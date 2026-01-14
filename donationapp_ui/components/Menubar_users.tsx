"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BlueBox from "./blueBox";

const menuSections = [
  {
    id: "main",
    items: [
      { href: "/users/management", th: "หน้าจัดการ", en: "Dashboard" },
      { href: "/users/account", th: "บัญชีผู้ใช้", en: "Account" },
    ],
  },
  {
    id: "donate",
    label: "การโดเนท / Donate",
    items: [
      { href: "/users/donate/payment", th: "หน้ารับเงิน", en: "Payment" },
      { href: "/users/donate/widgets", th: "วิดเจ็ต", en: "Widgets" },
      { href: "/users/voice", th: "เทรนเสียง", en: "Voice Training" },
    ],
  },
  {
    id: "history",
    label: "ประวัติ / Histories",
    items: [
      {
        href: "/users/donateHistory",
        th: "ประวัติรับเงิน",
        en: "Donate History",
      },
    ],
  },
];

const Manubars = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center">
      {/* bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] */}
      <BlueBox className="relative w-48 lg:w-64 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] px-8 py-10 text-white">
        <nav className="flex flex-col gap-8 text-sm">
          {menuSections.map((section) => (
            <div key={section.id} className="space-y-3">
              {section.label && (
                <>
                  <p className="text-[11px] uppercase tracking-wide text-white/35">
                    {section.label}
                  </p>

                  <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
                </>
              )}

              <div className="space-y-4">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group block"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={
                            "h-6 w-1.5 rounded-full bg-[#005EFF] transition-opacity duration-200 " +
                            (isActive ? "opacity-100" : "opacity-0")
                          }
                        />

                        <div
                          className={
                            "flex flex-col transition-colors " +
                            (isActive
                              ? "text-white"
                              : "text-white/60 group-hover:text-white")
                          }
                        >
                          <span className="text-[15px] leading-tight">
                            {item.th}
                          </span>
                          <span className="text-[11px] leading-tight text-white/40 group-hover:text-white/60">
                            {item.en}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </BlueBox>
    </div>
  );
};

export default Manubars;
