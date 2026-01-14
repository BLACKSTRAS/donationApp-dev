"use client";

import React from "react";
import Manubars from "@/components/Menubar_users";
import Image from "next/image";
import BlueBox from "@/components/blueBox";

const AccountPage = () => {
  return (
    <>
      <div className="min-h-screen text-white">
        <div className="flex max-w-7xl mx-auto h-full pb-12">
          <div className="pt-20 pr-6">
            <Manubars />
          </div>

          <div className="flex-1 pt-16 pl-6 space-y-10">
            <section className="flex gap-6">
              <div className="flex-1 rounded-3xl bg-gradient-to-b from-[#1a2a5a] via-[#0e1b44] to-[#09101f] border border-white/20 p-8 relative shadow-[0_0_50px_-12px_rgba(0,209,255,0.18)] backdrop-blur-md">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#00D1FF] shadow-[0_0_25px_rgba(0,209,255,0.35)]">
                    <Image
                      src="/images/avatar1.avif"
                      alt="avatar"
                      fill
                      className="object-cover bg-blue-400"
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#0e1b44] shadow-lg hover:bg-[#00D1FF] hover:text-white transition-all cursor-pointer border border-white/50 active:scale-95">
                    <i
                      className="pi pi-images"
                      style={{ fontSize: "1.1rem" }}
                    ></i>
                  </div>
                </div>

                <div className="mt-20 flex flex-col items-center text-center">
                  <div className="flex pt-3 items-center gap-2 group cursor-pointer">
                    <h1 className="text-[28px] leading-tight font-bold tracking-wide text-white drop-shadow-sm">
                      NAME
                    </h1>
                    <i className="pi pi-pen-to-square text-[#00D1FF] group-hover:scale-110 transition-transform"></i>
                  </div>

                  <p className="text-[#00D1FF]/80 font-medium mt-1 pt-2 tracking-wider text-[13px]">
                    ABCDEF@GMAIL.COM
                  </p>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/25 to-transparent my-8" />

                  <div className="grid grid-cols-2 gap-6 w-full px-10 text-center">
                    <div className="group">
                      <div className="text-white/50 text-[11px] uppercase tracking-tight mb-2">
                        ยอดรับบริจาคทั้งหมด
                      </div>
                      <div className="pt-2 text-[22px] font-bold flex items-center justify-center gap-3 text-[#00D1FF]">
                        <i className="pi pi-credit-card text-[18px]"></i>
                        <span>1,000 บาท</span>
                      </div>
                    </div>

                    <div className="border-l border-white/10 px-6 group">
                      <div className="text-white/50 text-[11px] uppercase tracking-tight mb-2">
                        เข้าร่วมกับเราตั้งแต่
                      </div>
                      <div className="pt-2 text-[20px] font-bold text-white/90">
                        07 / 02 / 2568
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <BlueBox className="w-80 rounded-2xl p-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                <h2 className="text-[12px] font-semibold underline underline-offset-4 mb-5 tracking-wide">
                  จัดการบัญชี
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-white/50 text-[11px] mb-1">ชื่อผู้ใช้</p>
                    <div className="flex gap-1.5 text-[13px] text-white/90">
                      <span>คำนำหน้า</span>
                      <span>ชื่อ</span>
                      <span>นามสกุล</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/50 text-[11px] mb-1">
                        วันเดือนปีเกิด
                      </p>
                      <p className="text-[13px] text-white/90">
                        วัน / เดือน / ปี
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50 text-[11px] mb-1">
                        เลขบัตรประชาชน
                      </p>
                      <p className="text-[13px] text-white/90">1234567890123</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/50 text-[11px] mb-1">ที่อยู่</p>
                    <p className="text-[12px] text-white/85 leading-relaxed">
                      123 หมู่ 4 ตำบล/แขวง อำเภอ/เขต จังหวัด 10100
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <p className="text-white/50 text-[11px] mb-2">อีเมล</p>
                      <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[10px] text-white/70">
                        <i
                          className="pi pi-info-circle"
                          style={{ color: "#FFD700", fontSize: "1rem" }}
                        ></i>
                        ยังไม่ยืนยัน
                      </span>
                    </div>
                    <div>
                      <p className="text-white/50 text-[11px] mb-2">
                        เบอร์โทรศัพท์
                      </p>
                      <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[10px] text-white/70">
                        <i
                          className="pi pi-info-circle"
                          style={{ color: "#FFD700", fontSize: "1rem" }}
                        ></i>
                        ยังไม่ยืนยัน
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-[#3D4B63] hover:bg-[#465574] active:scale-[0.99] transition-all rounded-xl py-2.5 text-[13px] border border-white/10">
                      <span className="pi pi-cog text-[14px]"></span>
                      เปลี่ยนรหัสผ่าน
                    </button>
                  </div>
                </div>
              </BlueBox>
            </section>

            <section className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-6">
                <BlueBox className="rounded-2xl p-6 space-y-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                  <h2 className="text-[12px] font-semibold underline underline-offset-4 tracking-wide">
                    ตั้งค่าอีเมลและเบอร์โทรศัพท์มือถือ
                  </h2>

                  <div className="grid gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] text-white/80">อีเมล</label>
                      <input className="w-full rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 outline-none transition-all focus:border-[#00D1FF]/60 focus:bg-white/[0.07] placeholder:text-white/25" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] text-white/80">
                        เบอร์โทรศัพท์
                      </label>
                      <input className="w-full rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 outline-none transition-all focus:border-[#00D1FF]/60 focus:bg-white/[0.07] placeholder:text-white/25" />
                    </div>
                  </div>

                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.99] transition-all text-[12px] border border-white/10">
                    <span className="pi pi-wallet"></span>
                    บันทึกการตั้งค่า
                  </button>
                </BlueBox>

                <BlueBox className="rounded-2xl p-6 space-y-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                  <h2 className="text-[12px] font-semibold underline underline-offset-4 tracking-wide">
                    ตั้งค่าข้อมูลผู้ใช้งาน
                  </h2>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] text-white/80">
                        คำนำหน้า
                      </label>
                      <input className="w-full rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 outline-none transition-all focus:border-[#00D1FF]/60 focus:bg-white/[0.07] placeholder:text-white/25" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] text-white/80">
                        ชื่อจริง
                      </label>
                      <input className="w-full rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 outline-none transition-all focus:border-[#00D1FF]/60 focus:bg-white/[0.07] placeholder:text-white/25" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] text-white/80">
                        นามสกุล
                      </label>
                      <input className="w-full rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 outline-none transition-all focus:border-[#00D1FF]/60 focus:bg-white/[0.07] placeholder:text-white/25" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] text-white/80">
                      วัน / เดือน / ปี เกิด
                    </label>
                    <input className="w-full rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 outline-none transition-all focus:border-[#00D1FF]/60 focus:bg-white/[0.07] placeholder:text-white/25" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] text-white/80">
                      เลขบัตรประจำตัวประชาชน
                    </label>
                    <input className="w-full rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 outline-none transition-all focus:border-[#00D1FF]/60 focus:bg-white/[0.07] placeholder:text-white/25" />
                  </div>

                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.99] transition-all text-[13px] border border-white/10">
                    <span className="pi pi-wallet"></span>
                    บันทึกการตั้งค่า
                  </button>
                </BlueBox>

                <BlueBox className="rounded-2xl p-6 space-y-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                  <h2 className="text-[12px] font-semibold underline underline-offset-4 tracking-wide">
                    ตั้งค่าข้อมูลที่อยู่
                  </h2>

                  <div className="space-y-1">
                    <label className="text-[12px] text-white/80">ที่อยู่</label>
                    <textarea className="w-full h-28 rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 resize-none outline-none transition-all focus:border-[#00D1FF]/60 focus:bg-white/[0.07] placeholder:text-white/25" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] text-white/80">
                        ตำบล / เขต
                      </label>
                      <input className="w-full rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 outline-none transition-all focus:border-[#00D1FF]/60 focus:bg-white/[0.07] placeholder:text-white/25" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] text-white/80">
                        จังหวัด
                      </label>
                      <input className="w-full rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 outline-none transition-all focus:border-[#00D1FF]/60 focus:bg-white/[0.07] placeholder:text-white/25" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] text-white/80">
                        รหัสไปรษณีย์
                      </label>
                      <input className="w-full rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 outline-none transition-all focus:border-[#00D1FF]/60 focus:bg-white/[0.07] placeholder:text-white/25" />
                    </div>
                  </div>

                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.99] transition-all text-[13px] border border-white/10">
                    <span className="pi pi-map-marker"></span>
                    บันทึกการตั้งค่า
                  </button>
                </BlueBox>
              </div>

              <div className="flex flex-col gap-6">
                <BlueBox className="h-fit rounded-2xl p-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                  <h2 className="text-[12px] font-semibold mb-4 underline underline-offset-4 tracking-wide">
                    ฟีเจอร์ที่คุณมีอยู่
                  </h2>

                  <div className="space-y-4 text-[12px] text-white/70">
                    <div>
                      <p className="text-[11px] text-white/55">จำนวนเสียง</p>
                      <p className="mt-1 text-[13px] text-white/85">0 ไฟล์</p>
                    </div>

                    <div>
                      <p className="text-[11px] text-white/55">
                        การปรับแต่งรับบริจาค
                      </p>
                      <p className="mt-1 text-[13px] text-white/85">-</p>
                    </div>

                    <div>
                      <p className="text-[11px] text-white/55">วิดเจ็ต</p>
                      <p className="mt-1 text-[13px] text-white/85">
                        ใช้ได้ทุกอัน!
                      </p>
                    </div>
                  </div>
                </BlueBox>

                <BlueBox className="rounded-3xl p-8 space-y-10 border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent shadow-[0_0_45px_rgba(0,0,0,0.4)]">
                  <div>
                    <h2 className="text-[12px] font-semibold underline underline-offset-4 tracking-wide">
                      ตั้งค่าการรับเงิน
                    </h2>
                    <p className="text-[12px] text-white/45 mt-1">
                      จัดการช่องทางรับบริจาคของคุณ
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="group space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 border border-white/10">
                          <span className="pi pi-phone text-xs"></span>
                        </div>
                        <h3 className="text-[12px] font-semibold uppercase tracking-widest text-blue-200/80">
                          พร้อมเพย์
                        </h3>
                      </div>

                      <div className="relative">
                        <label className="text-[12px] text-white/50 ml-1 mb-1.5 block">
                          หมายเลขพร้อมเพย์
                        </label>
                        <input
                          type="text"
                          placeholder="08X-XXX-XXXX หรือ เลขบัตรประชาชน"
                          className="w-full rounded-2xl bg-white/5 px-5 py-4 text-[13px] border border-white/10 outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all duration-300 placeholder:text-white/25"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                      <span className="text-[10px] text-white/20 uppercase tracking-[0.25em]">
                        หรือ
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>

                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-white/10">
                          <span className="pi pi-building text-xs"></span>
                        </div>
                        <h3 className="text-[12px] font-semibold uppercase tracking-widest text-emerald-200/80">
                          บัญชีธนาคาร
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-5">
                        <div className="relative">
                          <label className="text-[12px] text-white/50 ml-1 mb-1.5 block">
                            ธนาคาร
                          </label>
                          <select className="w-full rounded-2xl bg-white/5 px-5 py-4 text-[13px] border border-white/10 outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 appearance-none cursor-pointer transition-all">
                            <option value="" className="bg-[#121212]">
                              เลือกธนาคารของคุณ
                            </option>
                            <option value="kbank" className="bg-[#121212]">
                              ธนาคารกสิกรไทย
                            </option>
                            <option value="scb" className="bg-[#121212]">
                              ธนาคารไทยพาณิชย์
                            </option>
                            <option value="bbl" className="bg-[#121212]">
                              ธนาคารกรุงเทพ
                            </option>
                            <option value="ktb" className="bg-[#121212]">
                              ธนาคารกรุงไทย
                            </option>
                          </select>
                          <span className="absolute right-5 top-[42px] pi pi-chevron-down text-[10px] text-white/30 pointer-events-none"></span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[12px] text-white/50 ml-1 block">
                            ชื่อบัญชี
                          </label>
                          <input
                            placeholder="ระบุชื่อ-นามสกุล เจ้าของบัญชี"
                            className="w-full rounded-2xl bg-white/5 px-5 py-4 text-[13px] border border-white/10 outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all placeholder:text-white/25"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[12px] text-white/50 ml-1 block">
                            เลขที่บัญชี
                          </label>
                          <input
                            placeholder="000-0-00000-0"
                            className="w-full rounded-2xl bg-white/5 px-5 py-4 text-[13px] border border-white/10 outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all placeholder:text-white/25"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 px-6 py-4 transition-all duration-300 hover:bg-blue-500 active:scale-[0.99] border border-white/10">
                      <div className="relative flex items-center justify-center gap-2">
                        <span className="pi pi-check-circle text-sm transition-transform group-hover:scale-110"></span>
                        <span className="text-[13px] font-bold tracking-wide">
                          บันทึกข้อมูลการรับเงิน
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  </div>
                </BlueBox>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
