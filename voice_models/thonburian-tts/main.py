import argparse
import logging
import sys
from pathlib import Path
import time

sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')
# นำเข้าคลาสจากไฟล์ inference.py ที่คุณมีอยู่
from flowtts.inference import FlowTTSPipeline, ModelConfig, AudioConfig

# ตั้งค่าการแสดงผล Log
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

def parse_args():
    parser = argparse.ArgumentParser(description="FlowTTS: โปรแกรมหลักสำหรับสั่งงาน F5-TTS และ E2-TTS")

    # --- เลือกโหมดการทำงาน ---
    parser.add_argument("--mode", type=str, choices=["tts", "vc", "interactive"], default="tts",
                        help="เลือกโหมด: 'tts' (ข้อความเป็นเสียง), 'vc' (เปลี่ยนเสียง), 'interactive' (พิมพ์โต้ตอบต่อเนื่อง)")

    # --- ข้อมูล Input/Output ---
    parser.add_argument("-t", "--text", type=str, default=None,
                        help="ข้อความที่ต้องการแปลงเป็นเสียง (จำเป็นสำหรับโหมด tts)")
    parser.add_argument("-i", "--input_audio", type=str, default=None,
                        help="ไฟล์เสียงต้นฉบับที่ต้องการเปลี่ยนเสียง (จำเป็นสำหรับโหมด vc)")
    parser.add_argument("-r", "--ref_audio", type=str, required=True,
                        help="ไฟล์เสียงอ้างอิง (Reference Audio) สำหรับโคลนเสียง")
    parser.add_argument("--ref_text", type=str, default=None,
                        help="ข้อความของเสียงอ้างอิง (ถ้าไม่ใส่ ระบบจะถอดความให้อัตโนมัติ)")
    parser.add_argument("-o", "--output", type=str, default="generated_audio.wav",
                        help="ชื่อไฟล์ผลลัพธ์ที่จะบันทึก (เช่น output.wav)")

    # --- การตั้งค่าโมเดล (Model Config) ---
    parser.add_argument("--language", type=str, default="th", choices=["en", "th"],
                        help="ภาษาของโมเดล ('en' หรือ 'th')")
    parser.add_argument("--model_type", type=str, default="F5", choices=["F5", "E2"],
                        help="ประเภทโมเดล (F5 หรือ E2)")
    parser.add_argument("--vocoder", type=str, default="vocos", choices=["vocos", "bigvgan"],
                        help="ประเภท Vocoder (ตัวสร้างคลื่นเสียง)")
    parser.add_argument("--device", type=str, default=None,
                        help="อุปกรณ์ที่ใช้ประมวลผล (เช่น 'cuda', 'cpu') ถ้าไม่ระบุจะเลือกให้อัตโนมัติ")
    parser.add_argument("--checkpoint", type=str, default="",
                        help="path ไปยังไฟล์ checkpoint โมเดล (ถ้าต้องการกำหนดเอง)")
    parser.add_argument("--vocab_file", type=str, default="",
                        help="path ไปยังไฟล์ vocab (ถ้าต้องการกำหนดเอง)")

    # --- การตั้งค่าเสียง/การเจน (Audio Config) ---
    parser.add_argument("--speed", type=float, default=1.0,
                        help="ความเร็วเสียงพูด (1.0 คือปกติ)")
    parser.add_argument("--seed", type=int, default=-1,
                        help="ค่า Random Seed (-1 คือสุ่มใหม่ทุกครั้ง)")
    parser.add_argument("--nfe", type=int, default=32,
                        help="จำนวนขั้นในการประมวลผล (Steps) ยิ่งเยอะยิ่งชัดแต่ช้า")
    parser.add_argument("--cfg", type=float, default=2.0,
                        help="ความแรงในการควบคุม (CFG Strength)")
    parser.add_argument("--silence_threshold", type=int, default=-45,
                        help="ระดับความดัง (dB) ที่จะตัดความเงียบออก")

    return parser.parse_args()

def run_interactive_mode(pipeline, ref_audio, ref_text, output_path, speed):
    """
    โหมด Interactive: ให้พิมพ์ข้อความในหน้าจอแล้วเจนเสียงต่อเนื่องโดยไม่ต้องโหลดโมเดลใหม่
    """
    logger.info(f"--- เข้าสู่โหมด Interactive (โต้ตอบ) ---")
    logger.info(f"ใช้เสียงอ้างอิงจาก: {ref_audio}")
    logger.info("พิมพ์ข้อความที่ต้องการแล้วกด Enter (พิมพ์ 'exit' หรือ 'quit' เพื่อออก)")

    counter = 1
    # แยกชื่อไฟล์และโฟลเดอร์เพื่อรันนัมเบอร์ไฟล์ output
    output_path_obj = Path(output_path)
    base_name = output_path_obj.stem
    output_dir = output_path_obj.parent
    extension = output_path_obj.suffix

    while True:
        try:
            print("\n[ใส่ข้อความ]: ", end='', flush=True)
            
            raw_data = sys.stdin.buffer.readline()
           
            if not raw_data: # ถ้าไม่มีข้อมูล (EOF) ให้หยุด
                break

           # 3. ระบบแปลงรหัสอัจฉริยะ (Smart Decode)
            try:
                # ลองแปลงแบบ UTF-8 (มาตรฐาน Linux/Docker)
                text = raw_data.decode('utf-8').strip()
            except UnicodeError:
                # ถ้าพัง แปลว่ามาจาก Windows แบบเก่า -> ใช้ CP874
                text = raw_data.decode('cp874', errors='ignore').strip()

            # ... (โค้ดส่วนตรวจสอบ exit/quit เหมือนเดิม) ...
            if text.lower() in ["exit", "quit"]:
                logger.info("ออกจากโปรแกรม...")
                break
            if not text.strip():
                continue

            # สร้างชื่อไฟล์ใหม่ เช่น output_1.wav, output_2.wav
            current_output = output_dir / f"{base_name}_{counter}{extension}"
            
            logger.info("กำลังประมวลผลเสียง...")
            pipeline(
                text=text,
                ref_voice=ref_audio,
                ref_text=ref_text,
                output_file=str(current_output),
                speed=speed,
                check_duration=True
            )
            logger.info(f"บันทึกไฟล์เรียบร้อยที่: {current_output}")
            counter += 1

        except KeyboardInterrupt:
            logger.info("\nหยุดการทำงานโดยผู้ใช้")
            break
        except Exception as e:
            logger.error(f"เกิดข้อผิดพลาด: {e}")

def main():
    args = parse_args()

    # 1. ตั้งค่า Configuration
    model_config = ModelConfig(
        device=args.device if args.device else ("cuda" if Path("/proc/driver/nvidia").exists() else "cpu"),
        model_type=args.model_type,
        language=args.language,
        vocoder=args.vocoder,
        checkpoint=args.checkpoint,
        vocab_file=args.vocab_file,
        seed=args.seed
    )

    audio_config = AudioConfig(
        speed=args.speed,
        nfe_step=args.nfe,
        cfg_strength=args.cfg,
        silence_threshold=args.silence_threshold
    )

    # 2. เริ่มต้น Pipeline (โหลดโมเดล)
    logger.info("กำลังเริ่มต้น FlowTTS Pipeline (โหลดโมเดล)...")
    try:
        pipeline = FlowTTSPipeline(
            model_config=model_config,
            audio_config=audio_config
        )
    except Exception as e:
        logger.error(f"โหลดโมเดลไม่สำเร็จ: {e}")
        sys.exit(1)

    # 3. เลือกทำงานตามโหมดที่ระบุ
    if args.mode == "tts":
        if not args.text:
            logger.error("ข้อผิดพลาด: ต้องระบุ --text เมื่อใช้โหมด tts")
            sys.exit(1)
        
        logger.info(f"เริ่มสร้างเสียงจากข้อความ: '{args.text}'")
        output_file = pipeline(
            text=args.text,
            ref_voice=args.ref_audio,
            ref_text=args.ref_text,
            output_file=args.output,
            speed=args.speed,
            check_duration=True
        )
        logger.info(f"สำเร็จ! ไฟล์เสียงถูกบันทึกที่: {output_file}")

    elif args.mode == "vc":
        if not args.input_audio:
            logger.error("ข้อผิดพลาด: ต้องระบุ --input_audio เมื่อใช้โหมด vc (Voice Conversion)")
            sys.exit(1)
            
        logger.info(f"เริ่มแปลงเสียงจากไฟล์ {args.input_audio}")
        with open(args.input_audio, 'rb') as f:
            output_file = pipeline.voice_conversion(
                reference_file=args.ref_audio,
                file_to_convert=f,
                output_file=args.output
            )
        logger.info(f"สำเร็จ! ไฟล์แปลงเสียงถูกบันทึกที่: {output_file}")

    elif args.mode == "interactive":
        run_interactive_mode(
            pipeline=pipeline,
            ref_audio=args.ref_audio,
            ref_text=args.ref_text,
            output_path=args.output,
            speed=args.speed
        )

if __name__ == "__main__":
    main()