'''
Demonstration of F5-TTS Engine for Thai language (Long Text Support)
'''
import logging
from pathlib import Path
import torch
import os
import numpy as np
import soundfile as sf
from cached_path import cached_path
from flowtts.inference import FlowTTSPipeline, ModelConfig, AudioConfig
from transformers import pipeline

logging.basicConfig(level=logging.INFO)

# --- ฟังก์ชันช่วยตัดแบ่งข้อความ (Chunking) ---
def split_text(text: str, max_chars: int = 120) -> list[str]:
    """
    ฟังก์ชันหั่นข้อความภาษาไทย:
    - แยกด้วยการขึ้นบรรทัดใหม่ก่อน
    - ถ้าบรรทัดไหนยาวเกิน ให้แยกด้วยการเว้นวรรค
    """
    chunks = []
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        if len(line) <= max_chars:
            chunks.append(line)
        else:
            words = line.split(' ')
            current_chunk = ""
            for word in words:
                if len(current_chunk) + len(word) < max_chars:
                    current_chunk += word + " "
                else:
                    chunks.append(current_chunk.strip())
                    current_chunk = word + " "
            if current_chunk:
                chunks.append(current_chunk.strip())
    return chunks

def thonburian_whisper(audio_file, model_name="biodatlab/whisper-th-medium-combined", lang="th"):
    '''
    ASR for transcribing the reference audio file.
    '''
    device = 0 if torch.cuda.is_available() else "cpu"
    pipe = pipeline(
        task="automatic-speech-recognition",
        model=model_name,
        chunk_length_s=30,
        device=device,
    )
    return pipe(str(audio_file), generate_kwargs={"language": f"<|{lang}|>", "task": "transcribe"}, batch_size=16)["text"]

def main():
    '''
    F5-TTS Demonstration for Long Text-to-Speech Generation
    '''
    # Configure model settings for F5
    model_config = ModelConfig(
        device="cuda" if os.path.exists("/proc/driver/nvidia") else "cpu",
        model_type="F5",
        language="th",
        checkpoint="hf://ThuraAung1601/E2-F5-TTS/F5_Thai/mega_f5_last.safetensors",
        vocab_file="hf://ThuraAung1601/E2-F5-TTS/F5_Thai/mega_vocab.txt",
        vocoder="vocos",
        seed=-1
    )
    
    # Update audio config
    audio_config = AudioConfig(
        silence_threshold=-45,
        max_audio_length=30000,   # ขยายเวลาต่อ Chunk เป็น 30 วินาที
        cfg_strength=2.5, 
        nfe_step=32,
        target_rms=0.1,
        cross_fade_duration=0.15,
        speed=1.0,
        min_silence_len=500,
        keep_silence=200,
        seek_step=10
    )

    # Initialize pipeline
    pipeline = FlowTTSPipeline(
        model_config=model_config,
        audio_config=audio_config,
        temp_dir="temp_f5"
    )

    # ข้อความทดสอบ (ยาวๆ)
    test_text = "ทดสอบ สวัสดีค่ะ นี่คือเสียงสำหรับการทดสอบเสียงโดเนท เพื่อใข้งานในการอ่านข้อความโดเนท 1 2 3 4 5 "
    
    # Create output directory
    output_dir = Path("outputs_f5")
    output_dir.mkdir(parents=True, exist_ok=True)

    # Reference data
    ref_voice = "temp_f5/refVoiceFemale.wav"
    ref_text = thonburian_whisper(ref_voice)

    # --- ส่วนที่แก้ไข: การ Generate แบบแบ่งส่วน (Long Text Logic) ---
    try:
        # 1. แบ่งข้อความเป็นท่อนๆ
        text_chunks = split_text(test_text, max_chars=100) # หั่นทุก 100 ตัวอักษร
        print(f"แบ่งข้อความได้ {len(text_chunks)} ส่วน: {text_chunks}")

        audio_segments = []
        sample_rate = 24000 # Default ของ F5/Vocos

        # 2. วนลูปสร้างเสียงทีละท่อน
        for i, chunk in enumerate(text_chunks):
            print(f"กำลังสร้างส่วนที่ {i+1}/{len(text_chunks)}: {chunk}...")
            
            chunk_file = output_dir / f"temp_part_{i}.wav"
            
            out_path = pipeline(
                text=chunk,
                ref_voice=ref_voice,
                ref_text=ref_text,
                output_file=str(chunk_file),
                speed=1.0,
                check_duration=True
            )
            
            # อ่านข้อมูลเสียงเก็บไว้ใน Memory
            data, sr = sf.read(out_path)
            sample_rate = sr
            audio_segments.append(data)
            
            # เพิ่มความเงียบระหว่างประโยค (0.3 วินาที)
            silence = np.zeros(int(0.3 * sr))
            audio_segments.append(silence)
            
            # ลบไฟล์ชั่วคราวทิ้ง
            if os.path.exists(out_path):
                os.remove(out_path)

        # 3. รวมไฟล์เสียงทั้งหมด (Stitching)
        if audio_segments:
            final_audio = np.concatenate(audio_segments)
            final_output_path = output_dir / "f5_output_long.wav"
            sf.write(final_output_path, final_audio, sample_rate)
            print(f"✅ สำเร็จ! บันทึกไฟล์เสียงรวมไว้ที่: {final_output_path}")
        else:
            print("❌ ไม่สามารถสร้างเสียงได้")

    except Exception as e:
        logging.error(f"Error during speech synthesis: {e}")

if __name__ == "__main__":
    main()