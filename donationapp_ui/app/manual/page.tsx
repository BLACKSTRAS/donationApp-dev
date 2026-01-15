"use client";

import Manubars from "@/components/Menubar_users";
import Image from "next/image";
import { Toast } from "primereact/toast";
import React, { useRef } from "react";

const steps = [
  {
    step: "01",
    title: "สมัครสมาชิก",
    desc: "สมัครบัญชีเพื่อเริ่มใช้งานระบบ Donate.app",
    images: [
      "/manual/register-1.png",
      "/manual/register-2.png",
      "/manual/register-3.png",
    ],
    bullets: [
      "พิมพ์ชื่อผู้ใช้งาน (Username) ที่ต้องการ",
      "ใส่อีเมลที่ใช้งานได้จริง",
      "ตั้งรหัสผ่าน และพิมพ์ยืนยันรหัสผ่านอีกครั้ง",
      "ติ๊กยอมรับเงื่อนไขการใช้งาน",
      "กดปุ่ม “สร้างบัญชี” เพื่อสมัครสมาชิก",
    ],
  },
  {
    step: "02",
    title: "เข้าสู่ระบบ",
    desc: "เข้าสู่ระบบเพื่อเริ่มใช้งาน Donate.app",
    images: [
      "/manual/register-1.png",
      "/manual/register-2.png",
      "/manual/register-3.png",
    ],
    bullets: [
      "พิมพ์ Username ที่สมัครไว้",
      "พิมพ์รหัสผ่าน",
      "กดปุ่ม “เข้าสู่ระบบ”",
      "ระบบจะพาไปยังหน้าบัญชีผู้ใช้ (Account)",
    ],
  },
  {
    step: "03",
    title: "หน้า Account",
    desc: "หน้าจัดการข้อมูลบัญชีและการตั้งค่าที่จำเป็นก่อนใช้งานระบบรับเงิน",
    images: [
      "/manual/register-1.png",
      "/manual/register-2.png",
      "/manual/register-3.png",
    ],
    bullets: [
      "แสดงและแก้ไขข้อมูลพื้นฐาน เช่น Email และเบอร์โทรศัพท์มือถือ",
      "ตั้งค่าข้อมูลผู้ใช้งานและข้อมูลที่อยู่",
      "ตั้งค่าการรับเงิน ซึ่งจำเป็นต้องทำก่อนใช้งานหน้ารับโดเนท",
      "หากยังไม่ตั้งค่าการรับเงิน ระบบจะไม่สามารถใช้งานหน้ารับเงินได้",
    ],
  },
  {
    step: "04",
    title: "หน้า Dashboard",
    desc: "หน้าสรุปข้อมูลการโดเนททั้งหมดของคุณ",
    images: [
      "/manual/register-1.png",
      "/manual/register-2.png",
      "/manual/register-3.png",
    ],
    bullets: [
      "ดูยอดเงินโดเนทรวมที่ได้รับ",
      "ดูจำนวนครั้งที่มีคนโดเนทให้",
      "ดูกราฟสรุปยอดย้อนหลัง",
      "ใช้หน้านี้เพื่อตรวจสอบรายได้ของคุณ",
    ],
  },
  {
    step: "05",
    title: "สร้างและตั้งค่าหน้ารับโดเนท",
    desc: "ตั้งค่าหน้ารับเงินสำหรับให้ผู้ชมส่งโดเนทสนับสนุนคุณ",
    images: [
      "/manual/register-1.png",
      "/manual/register-2.png",
      "/manual/register-3.png",
    ],
    bullets: [
      "พิมพ์ข้อความต้อนรับหรือข้อความอธิบายบนหน้ารับโดเนท (เช่น ขอบคุณสำหรับการสนับสนุน)",
      "ระบบจะสร้างลิงก์หน้ารับโดเนทให้โดยอัตโนมัติ",
      "กดปุ่ม “คัดลอกลิงก์” เพื่อนำไปแชร์ให้ผู้ชม",
      "ตั้งค่าคำที่ไม่ต้องการให้ผู้ชมพิมพ์มา (คำหยาบ / คำไม่เหมาะสม)",
      "สามารถเพิ่มคำต้องห้ามของตัวเองได้ และลบออกภายหลังได้",
      "กำหนดจำนวนเงินโดเนทขั้นต่ำ (เช่น ขั้นต่ำ 2 บาท)",
      "กดปุ่ม “บันทึก” เพื่อยืนยันการตั้งค่าทั้งหมด",
      "เมื่อบันทึกสำเร็จ หน้ารับโดเนทจะพร้อมใช้งานทันที",
    ],
  },
  {
    step: "06",
    title: "ตั้งค่า Widget แจ้งเตือนโดเนท",
    desc: "ตั้งค่ากล่องแจ้งเตือนเมื่อมีคนโดเนท เพื่อแสดงผลบนหน้าจอสตรีม",
    images: [
      "/manual/register-1.png",
      "/manual/register-2.png",
      "/manual/register-3.png",
    ],
    bullets: [
      "คัดลอกลิงก์ Widget ที่ระบบสร้างให้ (ใช้สำหรับเชื่อมต่อกับ OBS)",
      "เปิดใช้งาน Widget โดยกดสวิตช์ “เปิดใช้งาน”",
      "เลือกว่าจะให้แสดงโดเนทขึ้นจอสตีรม หรือไม่ โดยกดสวิตช์ “เปิดใช้งาน” ",
      "เลือกประเภท Widget ที่ต้องการใช้งาน (Main / Row / Notification)",
      "ปรับรูปแบบการแสดงผลของ Widget ให้เหมาะกับหน้าจอสตรีม",
      "ตั้งค่าข้อมูลตัวอย่าง เช่น ชื่อผู้โดเนท ข้อความ และจำนวนเงิน เพื่อดูตัวอย่าง",
      "กดปุ่ม “ทดลองการแจ้งเตือน” เพื่อเช็กการแสดงผล",
      "เมื่อปรับเสร็จแล้ว กดปุ่ม “บันทึกการตั้งค่า” เพื่อใช้งานจริง",
    ],
  },
  {
    step: "07",
    title: "นำ Widget ไปใช้ใน OBS",
    desc: "แสดงแจ้งเตือนโดเนทบนหน้าจอสตรีมด้วยโปรแกรม OBS",
    images: [
      "/images/8c0ddfe1-ca9b-4d9f-980c-7ca541ca6028.jpg",
      "/images/ai-voice-Stroke-Rounded 1.png",
      "/manual/register-3.png",
    ],
    bullets: [
      "เปิดโปรแกรม OBS บนคอมพิวเตอร์",
      "ดูที่ช่อง Sources (มุมล่างซ้าย) แล้วกดปุ่ม +",
      "เลือกเมนู Browser (หรือ Browser Source)",
      "ตั้งชื่อ Source เช่น “Donate Widget” แล้วกด OK",
      "นำลิงก์ Widget ที่คัดลอกมาจาก Donate.app มาวางในช่อง URL",
      "กำหนดความกว้าง (Width) และความสูง (Height) ตามที่ต้องการ เช่น 800 x 600",
      "ติ๊กเลือก “Control audio via OBS” หากต้องการให้เสียงแจ้งเตือนออก OBS",
      "กดปุ่ม OK เพื่อบันทึกการตั้งค่า",
      "ลากและปรับตำแหน่ง Widget บนหน้าจอ OBS ให้ตรงตำแหน่งที่ต้องการ",
      "ทดลองโดเนทหรือกดปุ่มทดสอบแจ้งเตือน เพื่อเช็กว่าขึ้นและมีเสียงถูกต้อง",
    ],
  },
  {
    step: "08",
    title: "เทรนเสียงสำหรับอ่านข้อความโดเนท",
    desc: "อัปโหลดและตั้งค่าเสียง เพื่อให้ระบบอ่านข้อความโดเนทด้วยเสียงของคุณ",
    images: [
      "/manual/register-1.png",
      "/manual/register-2.png",
      "/manual/register-3.png",
    ],
    bullets: [
      "เข้าเมนู เทรนเสียง (Voice Training) จากแถบเมนูด้านซ้าย",
      "หน้านี้ใช้สำหรับตั้งค่าเสียงที่ระบบจะนำไปอ่าน “ข้อความโดเนท” ให้คุณ",
      "อ่านข้อกำหนดและเงื่อนไขการใช้งานเสียงก่อนเริ่มอัปโหลด",
      "ไฟล์เสียงต้องเป็นนามสกุล .wav เท่านั้น",
      "ขนาดไฟล์เสียงต้องไม่เกิน 50MB",
      "ไฟล์เสียงควรเป็นเสียงพูดชัดเจน ไม่มีเสียงรบกวน",
      "แนะนำให้อัดเสียงอ่านข้อความตามที่ระบบกำหนด เพื่อให้ AI เรียนรู้เสียงได้ถูกต้อง",
      "ใช้เฉพาะเสียงที่คุณมีสิทธิ์ใช้งาน หรือเป็นเสียงของตัวเองเท่านั้น",
      "หากไฟล์เสียงไม่ใช่ .wav สามารถแปลงไฟล์ตามวิธีที่ระบบแนะนำ",
      "กดปุ่ม “อัปโหลดไฟล์เสียง” เพื่อเพิ่มไฟล์เข้าสู่ระบบ",
      "รอระบบตรวจสอบและประมวลผลเสียง (สถานะอาจขึ้นว่ากำลังตรวจสอบ)",
      "เมื่อผ่านการตรวจสอบแล้ว สามารถเลือกเสียงนี้ไปใช้ในการอ่านข้อความโดเนทได้",
    ],
  },
  {
    step: "09",
    title: "ดูประวัติการโดเนท",
    desc: "ตรวจสอบรายการโดเนททั้งหมดที่เคยมีคนสนับสนุนคุณ",
    images: [
      "/manual/register-1.png",
      "/manual/register-2.png",
      "/manual/register-3.png",
    ],
    bullets: [
      "เข้าเมนู ประวัติการโดเนท (Donate History) จากแถบเมนูด้านซ้าย",
      "หน้านี้จะแสดงรายการโดเนททั้งหมดที่เกิดขึ้นในระบบ",
      "ดูวันและเวลาที่มีการโดเนทเข้ามา",
      "ดูชื่อผู้โดเนทและข้อความที่ผู้ชมพิมพ์มา",
      "ดูจำนวนเงินที่โดเนทในแต่ละครั้ง",
      "ตรวจสอบช่องทางการบริจาคที่ผู้ชมใช้",
      "ดูสถานะการทำงานของรายการโดเนท (เช่น สำเร็จหรือไม่)",
      "ใช้หน้านี้เพื่อตรวจสอบความถูกต้องของรายได้",
      "หากมีปัญหา สามารถใช้ข้อมูลหน้านี้เป็นหลักฐานอ้างอิงได้",
    ],
  },
  {
    step: "10",
    title: "ทดสอบระบบโดเนทแบบครบ",
    desc: "ตรวจสอบการทำงานของระบบโดเนททั้งหมดก่อนใช้งานจริง",
    images: [
      "/manual/register-1.png",
      "/manual/register-2.png",
      "/manual/register-3.png",
    ],
    bullets: [
      "ตรวจสอบว่าตั้งค่าหน้ารับโดเนทเรียบร้อยแล้ว และสามารถเปิดหน้าเว็บได้",
      "เปิดลิงก์หน้ารับโดเนทจากเบราว์เซอร์ (เช่น เปิดในโหมดไม่ต้องล็อกอิน)",
      "ลองกรอกชื่อผู้โดเนท ข้อความ และจำนวนเงินทดลอง",
      "ทำการส่งโดเนททดลอง (ตามวิธีที่ระบบรองรับ)",
      "เปิดโปรแกรม OBS และตรวจสอบว่า Widget แสดงผลบนหน้าจอสตรีม",
      "เช็กว่ากล่องแจ้งเตือนโดเนทแสดงชื่อ ข้อความ และจำนวนเงินถูกต้อง",
      "ตรวจสอบเสียงอ่านข้อความโดเนท ว่าเล่นออกมาถูกต้องและชัดเจน",
      "ปรับระดับเสียงใน OBS หากเสียงดังหรือเบาเกินไป",
      "ตรวจสอบหน้า Dashboard ว่ายอดโดเนทอัปเดตตรงตามที่ทดสอบ",
      "ตรวจสอบหน้า ประวัติการโดเนท ว่ารายการแสดงครบและสถานะถูกต้อง",
      "หากทุกอย่างทำงานปกติ แสดงว่าระบบพร้อมใช้งานจริงสำหรับการไลฟ์",
    ],
  },
];

export default function ManualPage() {
  const toast = useRef<Toast | null>(null);
  const [previewImg, setPreviewImg] = React.useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050b1d] via-[#07142e] to-black text-white">
      <Toast ref={toast} />

      <div className="max-w-4/5 mx-auto flex gap-10 px-6 py-16">
        {/* Sidebar */}


        {/* Content */}
        <section className="flex-1 space-y-16 ">
          {/* Header */}
          <header className="text-center space-y-4 pt-10">
            <h1 className="text-4xl font-bold tracking-wide">
              คู่มือการใช้งานระบบ Donate.app
            </h1>
          </header>

          {/* Steps */}
          <div className="space-y-14 ">
            {steps.map((s) => (
              <section
                key={s.step}
                className="bg-white/5 backdrop-blur-xl rounded-2xl
                           p-8 md:p-10 shadow-xl border border-white/10"
              >
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  {/* Text */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <span>STEP {s.step}</span>
                      <h2 className="text-2xl font-semibold">{s.title}</h2>
                    </div>

                    <p className="text-gray-300 leading-relaxed">{s.desc}</p>

                    <ul className="list-disc pl-6 space-y-2 text-gray-200">
                      {s.bullets.map((b, i) => (
                        <li key={i} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Images */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {s.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setPreviewImg(img)}
                        className="relative w-full h-[200px]
                 rounded-xl overflow-hidden
                 border border-white/10
                 cursor-pointer
                 hover:opacity-80 transition"
                      >
                        <Image
                          src={img}
                          alt={`${s.title}-${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
          </div>
        </section>
      ))}
    </div>
    {previewImg && (
      <div
      className="fixed inset-0 z-50
             bg-black/80
             flex items-center justify-center
             px-4"
             onClick={() => setPreviewImg(null)}
             >
        <div
          className="relative max-w-5xl w-full
          max-h-[90vh]
          bg-black rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          >
          {/* Close button */}
          <button
            onClick={() => setPreviewImg(null)}
            className="absolute top-3 right-3 z-50
            text-white text-2xl
            bg-black/60 rounded-full
            w-10 h-10 flex items-center justify-center
            cursor-pointer"
            >
            ✕
          </button>

          {/* Image */}
          <div className="relative w-full h-[80vh]">
            <Image
              src={previewImg}
              alt="Preview"
              fill
              className="object-contain"
              />
          </div>
        </div>
      </div>
    )}
      </section>
    </div>
  </main>
);
}
