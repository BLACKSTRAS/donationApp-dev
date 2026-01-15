"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASEURL;

type DashboardStats = {
  totalUsers: number;
  totalVoices: number;
  pendingVoices: number;
  bannedWords: number;
  bannedUsers: number;
};

type CardItem = {
  th: string;
  en: string;
  value: number;
  priority: "normal" | "warning" | "danger";
};

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE}/admin/dashboard/stats`, {
        credentials: "include",
      });
      const json = await res.json();
      setStats(json.data);
    })();
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  const items: CardItem[] = [
    {
      th: "ผู้ใช้ทั้งหมด",
      en: "Total Users",
      value: stats.totalUsers,
      priority: "normal",
    },
    {
      th: "เสียงในระบบ",
      en: "Total Voices",
      value: stats.totalVoices,
      priority: "normal",
    },
    {
      th: "เสียงรอตรวจสอบ",
      en: "Pending Voices",
      value: stats.pendingVoices,
      priority: "warning",
    },
    {
      th: "คำต้องห้าม",
      en: "Banned Words",
      value: stats.bannedWords,
      priority: "normal",
    },
    {
      th: "ผู้ใช้ถูกระงับ",
      en: "Banned Users",
      value: stats.bannedUsers,
      priority: "danger",
    },
  ];

  const priorityStyle = {
    normal: {
      ring: "hover:ring-cyan-400/40",
      accent: "text-cyan-400",
      glow: "from-cyan-500/20",
    },
    warning: {
      ring: "hover:ring-yellow-400/40",
      accent: "text-yellow-400",
      glow: "from-yellow-500/25",
    },
    danger: {
      ring: "hover:ring-red-500/40",
      accent: "text-red-400",
      glow: "from-red-500/25",
    },
  };

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            แดชบอร์ดผู้ดูแลระบบ
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Overview of system status
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {items.map((item) => {
          const p = priorityStyle[item.priority];

          return (
            <div
              key={item.th}
              className={`group relative cursor-pointer rounded-2xl border border-white/10 bg-[#0A1635] p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:ring-1 ${p.ring}`}
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${p.glow} to-transparent opacity-40`}
              />

              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">{item.th}</p>
                    <p className="text-xs text-white/40">{item.en}</p>
                  </div>
                </div>

                <div
                  className={`text-4xl font-bold tracking-tight ${p.accent}`}
                >
                  {item.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
