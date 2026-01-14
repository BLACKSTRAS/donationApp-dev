# ใช้ Base Image เดิม
FROM pytorch/pytorch:2.4.0-cuda12.1-cudnn9-runtime

# ตั้งค่า Environment พื้นฐาน
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# สร้างโฟลเดอร์ทำงานหลัก
WORKDIR /app

# ติดตั้ง ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# ติดตั้ง dependencies (จาก requirements.txt ที่อยู่หน้าหลัก)
COPY requirements.txt .
# สั่งลง requirements ก่อน แล้วค่อยบังคับลง torch/audio ให้ตรงรุ่นอีกทีเพื่อความชัวร์
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir torch==2.4.0 torchaudio==2.4.0 torchvision==0.19.0 --index-url https://download.pytorch.org/whl/cu118
RUN pip uninstall -y torchcodec
# Copy ไฟล์ทั้งหมดเข้า container (จะได้โฟลเดอร์ thonburian-tts เข้ามาด้วย)
COPY . .


WORKDIR /app/thonburian-tts

# เปิด Port 5000
EXPOSE 5000

# รันคำสั่ง (ตอนนี้เราอยู่ในโฟลเดอร์ thonburian-tts แล้ว คำสั่งนี้จะทำงานได้)
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "5000"]