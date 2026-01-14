import logging
import os
import uuid
import shutil
from pathlib import Path
from contextlib import asynccontextmanager

import numpy as np
import soundfile as sf
import torch
from transformers import pipeline as hf_pipeline

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import FileResponse

from flowtts.inference import FlowTTSPipeline, ModelConfig, AudioConfig

# ================= Logging =================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api")

# ================= Global =================
pipeline_tts: FlowTTSPipeline | None = None
asr_pipe = None  # Whisper ASR

VOICE_REF_DIR = Path("/app/shared/audios/voiceRef")

TEMP_DIR = Path("temp_files")
OUTPUT_DIR = Path("outputs")

SAMPLE_RATE = 24000
SILENCE_SEC = 0.25

# ================= Utils =================
def split_text(text: str, max_chars: int = 180):
    chunks = []
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue

        if len(line) <= max_chars:
            chunks.append(line)
        else:
            words = line.split(" ")
            buf = ""
            for w in words:
                if len(buf) + len(w) < max_chars:
                    buf += w + " "
                else:
                    chunks.append(buf.strip())
                    buf = w + " "
            if buf:
                chunks.append(buf.strip())
    return chunks


def get_ref_text(ref_voice_path: Path) -> str:
    """
    ถอดเสียง ref_voice ด้วย Whisper (ครั้งเดียว)
    แล้ว cache เป็น .txt ข้างไฟล์ wav
    """
    txt_path = ref_voice_path.with_suffix(".txt")

    if txt_path.exists():
        return txt_path.read_text(encoding="utf-8")

    logger.info(f"📝 Transcribing ref voice: {ref_voice_path.name}")
    result = asr_pipe(
        str(ref_voice_path),
        generate_kwargs={"language": "<|th|>", "task": "transcribe"},
        batch_size=16
    )

    ref_text = result["text"].strip()
    txt_path.write_text(ref_text, encoding="utf-8")
    return ref_text


# ================= Lifespan =================
@asynccontextmanager
async def lifespan(app: FastAPI):
    global pipeline_tts, asr_pipe

    TEMP_DIR.mkdir(exist_ok=True)
    OUTPUT_DIR.mkdir(exist_ok=True)

    logger.info("🚀 Loading FlowTTS Model...")

    model_config = ModelConfig(
        device="cuda" if os.path.exists("/proc/driver/nvidia") else "cpu",
        model_type="F5",
        language="th",
        checkpoint="hf://ThuraAung1601/E2-F5-TTS/F5_Thai/mega_f5_last.safetensors",
        vocab_file="hf://ThuraAung1601/E2-F5-TTS/F5_Thai/mega_vocab.txt",
        vocoder="vocos",
        seed=-1
    )

    audio_config = AudioConfig(
        silence_threshold=-45,
        max_audio_length=30000,
        cfg_strength=2.3,
        nfe_step=16,
        target_rms=0.1,
        cross_fade_duration=0.12,
        speed=1.0,
        min_silence_len=400,
        keep_silence=150,
        seek_step=10
    )

    pipeline_tts = FlowTTSPipeline(
        model_config=model_config,
        audio_config=audio_config,
        temp_dir=str(TEMP_DIR)
    )

    logger.info("🧠 Loading Whisper ASR...")
    asr_pipe = hf_pipeline(
        task="automatic-speech-recognition",
        model="biodatlab/whisper-th-medium-combined",
        device=0 if torch.cuda.is_available() else "cpu",
    )

    # 🔥 Warm-up (ใช้ ref_text จริง)
    voice_files = list(VOICE_REF_DIR.glob("*.wav"))
    if voice_files:
        ref_voice = voice_files[0]
        ref_text = get_ref_text(ref_voice)

        warmup_out = TEMP_DIR / "warmup.wav"
        pipeline_tts(
            text="ทดสอบ",
            ref_voice=str(ref_voice),
            ref_text=ref_text,
            output_file=str(warmup_out),
            check_duration=False
        )
        if warmup_out.exists():
            warmup_out.unlink()

    logger.info("✅ Model ready")
    yield

    shutil.rmtree(TEMP_DIR, ignore_errors=True)


# ================= App =================
app = FastAPI(
    title="FlowTTS Fast Production API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/tts")
def tts_fast(
    text: str = Form(...),
    ref_voice_name: str = Form(...),
    speed: float = Form(1.0)
):
    if not pipeline_tts:
        raise HTTPException(500, "Model not loaded")

    ref_voice_path = (VOICE_REF_DIR / ref_voice_name).resolve()

    if not ref_voice_path.exists():
        raise HTTPException(404, "Reference voice file not found")

    if VOICE_REF_DIR not in ref_voice_path.parents:
        raise HTTPException(400, "Invalid reference voice path")

    ref_text = get_ref_text(ref_voice_path)

    request_id = str(uuid.uuid4())
    output_path = OUTPUT_DIR / f"{request_id}.wav"

    chunks = split_text(text)
    silence = np.zeros(int(SAMPLE_RATE * SILENCE_SEC))

    with sf.SoundFile(
        output_path,
        mode="w",
        samplerate=SAMPLE_RATE,
        channels=1,
        subtype="PCM_16"
    ) as out_f:

        for idx, chunk in enumerate(chunks):
            temp_out = TEMP_DIR / f"{request_id}_{idx}.wav"

            pipeline_tts(
                text=chunk,
                ref_voice=str(ref_voice_path),
                ref_text=ref_text,   # 🔥 หัวใจสำคัญ
                output_file=str(temp_out),
                speed=speed,
                check_duration=True
            )

            data, _ = sf.read(temp_out, dtype="float32")
            out_f.write(data)
            out_f.write(silence)

            temp_out.unlink()

    return FileResponse(
        output_path,
        media_type="audio/wav",
        filename="tts.wav"
    )


# ================= Run =================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
