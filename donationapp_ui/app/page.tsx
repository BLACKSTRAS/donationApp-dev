"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./globals.css";

type FAQ = { q: string; a: string };

const Page = () => {
  const router = useRouter();
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const handleClick = () => {
    router.push("/users/account"); // จำลองย้ายไปหน้าใช้งาน
  };

  const faqs: FAQ[] = useMemo(
    () => [
      {
        q: "donate.app คืออะไร?",
        a: "แพลตฟอร์มรับเงินโดเนทสำหรับสตรีมเมอร์ที่เน้นความเร็ว ใช้งานง่าย และเพิ่มลูกเล่นด้วยเสียง AI / Voice Cloning เพื่อให้การแจ้งเตือนโดเนทสนุกขึ้น",
      },
      {
        q: "ฟรีจริงไหม?",
        a: "เริ่มต้นใช้งานได้ฟรี และค่อยอัปเกรดฟีเจอร์เพิ่มเติมภายหลังได้ (ขึ้นกับแพลนที่คุณทำไว้ในระบบ)",
      },
      {
        q: "เงินเข้าทันทีไหม?",
        a: "แนวคิดหลักคือรับเงินเข้าบัญชีโดยตรงและเร็วที่สุด (ขึ้นกับการผูกบัญชีและช่องทางรับเงินที่คุณตั้งค่า)",
      },
      {
        q: "Voice Cloning ใช้ยังไง?",
        a: "อัปโหลด/บันทึกตัวอย่างเสียงตามเงื่อนไขที่ระบบกำหนด แล้วให้ระบบสร้างโมเดลเสียงเพื่อใช้อ่านโดเนทในสตรีม",
      },
    ],
    []
  );

  return (
    <main className="min-h-screen flex flex-col w-full bg-cover bg-center relative overflow-hidden">
      <div className="flex-1" id="home">
        {/* HERO */}
        <section className="mx-auto w-full max-w-7xl px-4 mt-14">
          <div className="grid grid-cols-12 gap-6 items-center">
            {/* Left */}
            <div className="col-span-12 lg:col-span-7">
              <div className="rounded-3xl border border-[#5E84FF]/50 bg-[#3A3A53]/35 backdrop-blur-md p-8 shadow-[0_0_40px_rgba(0,0,0,0.55)]">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                  <span className="h-2 w-2 rounded-full bg-[#5E84FF]" />
                  รับเงินโดเนทของคุณ เข้าบัญชีตรง ๆ ทันที
                </div>

                <div className="mt-6 flex items-center gap-6">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={96}
                    height={96}
                    className="select-none drop-shadow-xl"
                    priority
                  />
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[0.95]">
                    <span className="bg-linear-to-r from-white via-[#5E84FF] to-[#005EFF] bg-clip-text text-transparent">
                      donate.app
                    </span>
                  </h1>
                </div>

                <h2 className="mt-5 text-2xl sm:text-3xl font-semibold text-white">
                  โดเนท ได้ด้วยเสียงคุณ
                </h2>

                <p className="mt-4 text-white/70 leading-relaxed text-base sm:text-lg">
                  ระบบโดเนทสำหรับสตรีมเมอร์ยุคใหม่ ใช้งานง่าย
                  และเพิ่มความสนุกด้วยเสียง
                </p>
                <p className="mt-2 text-white/70 leading-relaxed text-base sm:text-lg">
                  AI / Voice Cloning
                </p>

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleClick}
                    className="inline-flex items-center justify-center rounded-full bg-[#005EFF] hover:bg-[#2F6BFF] px-8 py-3 text-lg font-semibold text-white shadow-lg transition active:scale-[0.98]"
                  >
                    ลองเลย
                    <span className="ml-2">
                      <Image
                        src="/images/swipe up.png"
                        alt="swipe up"
                        width={22}
                        height={22}
                      />
                    </span>
                  </button>

                  <div className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80">
                    ไม่มีหักค่าธรรมเนียม • เงินเข้าไว
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { t: "0%", d: "ค่าธรรมเนียม" },
                    { t: "ทันที", d: "เงินเข้า" },
                    { t: "สวย", d: "หน้าเพจ/วิดเจ็ต" },
                  ].map((x) => (
                    <div
                      key={x.d}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                    >
                      <div className="text-xl font-extrabold text-white">
                        {x.t}
                      </div>
                      <div className="text-xs text-white/60 mt-1">{x.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Preview */}
            <div className="col-span-12 lg:col-span-5">
              <div className="rounded-3xl border border-[#5E84FF]/50 bg-[#3A3A53]/35 backdrop-blur-md p-6 shadow-[0_0_40px_rgba(0,0,0,0.55)]">
                <div className="flex items-center justify-between">
                  <div className="text-white font-semibold">
                    ตัวอย่างหน้า Donate
                  </div>
                  <div className="text-xs text-white/60">Preview</div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
                  <div className="h-12 border-b border-white/10 bg-black/20 flex items-center gap-2 px-4">
                    <span className="h-2 w-2 rounded-full bg-white/30" />
                    <span className="h-2 w-2 rounded-full bg-white/30" />
                    <span className="h-2 w-2 rounded-full bg-white/30" />
                    <div className="ml-3 text-xs text-white/50">donate.app</div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                        <Image
                          src="/images/logo.png"
                          alt="logo"
                          width={32}
                          height={32}
                        />
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          Streamer Name
                        </div>
                        <div className="text-xs text-white/50">
                          ขอบคุณสำหรับการสนับสนุน 💙
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {[10, 20, 100].map((m) => (
                        <div
                          key={m}
                          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center text-sm font-semibold text-white/90"
                        >
                          {m}฿
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                      ข้อความโดเนท… (พิมพ์ข้อความที่อยากให้ขึ้นจอสตรีม)
                    </div>

                    <button className="mt-4 w-full rounded-full bg-[#005EFF] hover:bg-[#2F6BFF] py-3 text-sm font-semibold text-white shadow-lg transition">
                      โดเนทเลย
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-xs text-white/50">
                  * เป็นตัวอย่าง UI เพื่อโชว์ฟีลหน้าเพจ
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES (4 ข้อ แบบแถวๆ เหมือนเว็บตัวอย่าง) */}
        <section className=" w-full flex flex-col  mt-10 px-34 mb-16 ">
          {/* <div className=" text-4xl mb-8  text-center">
            <span className="text-6xl  text-white font-semibold">ฟีเจอร์</span>
          </div> */}
          <div className="grid grid-cols-12 grid-rows-12 gap-3 mt-16">
            <div className="col-span-6 row-span-6  rounded-3xl border border-[#5E84FF]/75 bg-[#3A3A53]/50 backdrop-blur-md px-10 py-8  text-white shadow-[0_0_40px_rgba(0,0,0,0.6)]">
              <div className=" flex items-center gap-4">
                <Image
                  src={"/images/speech-to-text-Stroke-Rounded 1.png"}
                  alt="Stroke-Rounded"
                  width={64}
                  height={64}
                  className=" object-cover mb-6"
                />
                <h2 className=" text-3xl font-extrabold">Speech To Text</h2>
              </div>
              <h3 className="text-2xl text-white font-semibold mb-2">
                อ่านข้อความโดเนทด้วยเสียง
              </h3>
              <span className="text-sx text-white leading-relaxed">
                ฟีเจอร์อ่านข้อความโดเนทด้วยเสียงของ AI ตามโมเดลที่คุณเลือก
              </span>
            </div>
            <div className="col-span-6 row-span-12 rounded-3xl border border-[#5E84FF]/75 bg-[#3A3A53]/50 backdrop-blur-md px-10 py-8  text-white shadow-[0_0_40px_rgba(0,0,0,0.6)]">
              <div className=" flex items-center gap-4">
                <Image
                  src={"/images/ai-voice-Stroke-Rounded 1.png"}
                  alt="Stroke-Rounded"
                  width={64}
                  height={64}
                  className=" object-cover mb-6"
                />
                <h2 className=" text-3xl font-extrabold">VOICE CLONING</h2>
              </div>
              <div>
                <h3 className="text-2xl text-white font-semibold mb-2">
                  ลองรับการสร้างโมเดลเสียงด้วยตัวคุณเอง
                </h3>
                <span className="text-sx text-white leading-relaxed">
                  ฟีเจอร์ในการสร้างโมเดลเสียงจากตัวอย่างเสียงที่คุณเลือก
                  เพื่อเพิ่มสีสรรค์ในการอ่านข้อความโดเนท เมื่อสตรีม
                </span>
              </div>
              <div className=" mt-6">
                <span className="text-sx text-white leading-relaxed">
                  Tip : เงื่อนไขและข้อตกลงในการสร้างโมเดลเสียงต้องเป็นไปตามระบบ
                  ตรวจสอบเท่านั้น สามารถอ่านเงื่อนไขการสร้างโมเดลเสียงได้ที่นี่
                </span>
              </div>
              <div className=" mt-6">
                <button className="mt-4 inline-flex items-center justify-center rounded-full bg-[#005EFF] hover:bg-[#2F6BFF] px-8 py-4 text-lg font-semibold text-white shadow-lg transition">
                  ตรวจสอบเงื่อนไขและข้อตกลง
                </button>
              </div>
            </div>
            <div className="col-span-6 row-span-6 rounded-3xl border border-[#5E84FF]/75 bg-[#3A3A53]/50 backdrop-blur-md px-10 py-8  text-white shadow-[0_0_40px_rgba(0,0,0,0.6)]">
              <div className=" flex items-center gap-4">
                <Image
                  src={"/images/credit-card-pos-Stroke-Rounded 1.png"}
                  alt="Stroke-Rounded"
                  width={64}
                  height={64}
                  className=" object-cover mb-6"
                />
                <h2 className=" text-3xl font-extrabold">Credit Card</h2>
              </div>
              <h3 className="text-2xl text-white font-semibold mb-2">
                รับเงินตรงผ่านบัญชีคุณ
              </h3>
              <span className="text-sx text-white leading-relaxed">
                รับเงินโดเนทโดยตรงผ่านบัญชีของคุณโดยไม่เรี่ยกเก็บ %
                แม้แต่อย่างใด !
              </span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto w-full max-w-7xl px-4 mt-22 mb-16">
          <div className="rounded-3xl border border-[#5E84FF]/50 bg-[#3A3A53]/35 backdrop-blur-md px-8 py-10 shadow-[0_0_40px_rgba(0,0,0,0.55)]">
            <div className="text-center">
              <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
                คำถามที่พบบ่อย
              </h3>
              <p className="mt-2 text-white/60">Frequently Asked Questions</p>
            </div>

            <div className="mt-8 space-y-3">
              {faqs.map((f, i) => {
                const isOpen = openFAQ === i;
                return (
                  <div
                    key={f.q}
                    className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFAQ(isOpen ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="font-semibold text-white/90">{f.q}</span>
                      <span className="text-white/60">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-white/70 leading-relaxed">
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={handleClick}
                className="inline-flex items-center justify-center rounded-full bg-[#005EFF] hover:bg-[#2F6BFF] px-10 py-3 text-lg font-semibold text-white shadow-lg transition active:scale-[0.98]"
              >
                สนใจแล้วใช่มั้ย • มาเริ่มต้นกัน
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mx-auto w-full max-w-7xl px-4 pb-10">
          <div className="rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md px-6 py-6 text-white/70 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="Logo" width={34} height={34} />
              <div className="text-sm">
                <div className="font-semibold text-white/90">donate.app</div>
                <div className="text-white/50">
                  สัมผัสประสบการณ์การรับโดเนทขึ้นจอแบบใหม่
                </div>
              </div>
            </div>
            <div className="text-xs text-white/50">
              © {new Date().getFullYear()} donate.app — All rights reserved
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Page;
