"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "SUPER_ADMIN" | "ADMIN";

const CURRENT_ROLE: Role = "SUPER_ADMIN";

const MENU = [
  {
    th: "แดชบอร์ด",
    en: "Dashboard",
    path: "/admin",
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    th: "ผู้ใช้",
    en: "Users",
    path: "/admin/users",
    roles: ["SUPER_ADMIN"],
  },
  {
    th: "โดเนท",
    en: "Donations",
    path: "/admin/Donations",
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    th: "เสียง",
    en: "Voice",
    path: "/admin/voice",
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[#050A1E] text-white">
      <aside className="w-64 bg-[#020617] border-r border-white/10 flex flex-col">
        <div className="px-6 py-5 border-b border-white/10">
          <h1 className="text-xl font-bold text-cyan-400">
            ระบบผู้ดูแล
          </h1>
          <p className="text-xs text-white/40">
            Admin Control Panel
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {MENU.filter((m) => m.roles.includes(CURRENT_ROLE)).map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-2 rounded-lg transition
                  ${
                    active
                      ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_14px_rgba(0,200,255,0.45)]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <div>
                  <p className="text-sm">{item.th}</p>
                  <p className="text-xs text-white/40">{item.en}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-white/10 text-xs text-white/40">
          สิทธิ์ผู้ใช้: {CURRENT_ROLE}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 bg-gradient-to-br from-[#050A1E] to-[#020617]">
          {children}
        </main>
      </div>
    </div>
  );
}
