"use client";

import React, { useState } from "react";
import Manubars from "@/components/Menubar_users";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ตรงนี้สามารถเชื่อม API ภายหลังได้
    alert("ส่งข้อความเรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็ว");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050b1d] via-[#07142e] to-black text-white">
      <div className="max-w-7xl mx-auto flex gap-10 px-6 py-16">
   

        {/* Content */}
        <section className="flex-1 space-y-14">
          {/* Header */}
          <header className="text-center space-y-4 pt-10">
            <h1 className="text-4xl font-bold tracking-wide">ติดต่อเรา</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              หากคุณมีคำถาม ปัญหาการใช้งาน หรือข้อเสนอแนะ  
              สามารถส่งข้อความถึงทีมงาน Donate.app ได้ที่หน้านี้
            </p>
          </header>

          {/* Contact Card */}
          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-xl border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  ชื่อผู้ติดต่อ
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="กรอกชื่อของคุณ"
                  className="w-full rounded-lg bg-black/40 border border-white/10
                             px-4 py-3 text-white placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  อีเมล
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="example@email.com"
                  className="w-full rounded-lg bg-black/40 border border-white/10
                             px-4 py-3 text-white placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  ข้อความ
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="พิมพ์รายละเอียดที่ต้องการติดต่อ..."
                  className="w-full rounded-lg bg-black/40 border border-white/10
                             px-4 py-3 text-white placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg
                           bg-blue-600 hover:bg-blue-500
                           transition font-semibold"
              >
                ส่งข้อความถึงทีมงาน
              </button>
            </form>
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm pt-10">
            © 2026 donate.app — ติดต่อทีมงาน
          </footer>
        </section>
      </div>
    </main>
  );
}
