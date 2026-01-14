"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_API_BASEURL;
const PAGE_SIZE = 10;

type VoiceStatus = "System" | "Pending" | "Approved" | "Rejected";

type Voice = {
  id: number;
  name: string;
  status: VoiceStatus;
  uploader: string | null;
};

export default function VoicePage() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/admin/voices?search=${search}&page=${page}&limit=${PAGE_SIZE}`,
        {
          credentials: "include",
/*           signal: controller.signal,
 */        }
      );
      return await res.json();

      /*       const json = await res.json();
      
            if (!controller.signal.aborted) {
            
              setLoading(false);
            } */
    };

    fetchVoices().then((d) => {
      setVoices(
        (d.data || []).map((v: any) => ({
          id: v.model_id,
          name: v.model_name,
          uploader: v.user_name ?? null,
          status:
            v.user_name === null
              ? "System"
              : v.status === 1
                ? "Approved"
                : v.status === 2
                  ? "Rejected"
                  : "Pending",
        }))
      );
    }).finally(() => {
      setLoading(false)

    }
    )

    /*     return () => controller.abort();
     */
  }, [search, page]);

  const filtered = useMemo(() => {
    if (!search) return voices;
    return voices.filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [voices, search]);

  const playVoice = async (id: number) => {
    if (playingId === id && audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setPlayingId(id);

    const res = await fetch(`${API_BASE}/admin/voices/${id}/play`, {
      credentials: "include",
    });

    if (!res.ok) {
      alert("ไม่สามารถเล่นเสียงได้");
      setPlayingId(null);
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.play().catch(() => {
      alert("Browser block การเล่นเสียง");
      setPlayingId(null);
    });

    audio.onended = () => {
      URL.revokeObjectURL(url);
      audioRef.current = null;
      setPlayingId(null);
    };
  };

  const updateStatus = async (id: number, status: "Approved" | "Rejected") => {
    setVoices((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));

    await fetch(`${API_BASE}/admin/voices/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        status: status === "Approved" ? 1 : 2,
      }),
    });
  };

  const statusStyle = {
    System: "bg-cyan-500/20 text-cyan-400",
    Pending: "bg-yellow-500/20 text-yellow-400",
    Approved: "bg-green-500/20 text-green-400",
    Rejected: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-cyan-400">Voice Management</h2>
          <p className="text-sm text-white/50 mt-1">
            Review and manage system & user uploaded voices
          </p>
        </div>

        <div className="rounded-xl bg-white/5 px-5 py-3 text-sm">
          <span className="text-white/40">ทั้งหมด </span>
          <span className="font-semibold text-cyan-400">{voices.length}</span>
          <span className="text-white/40"> ไฟล์</span>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="ค้นหาไฟล์เสียง..."
        className="h-11 w-96 rounded-xl bg-[#020617] px-4 text-sm
        border border-white/10 outline-none focus:border-cyan-400/60"
      />

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/10 text-sm text-white/60">
            <tr>
              <th className="p-4 w-16 text-center">#</th>
              <th>ชื่อไฟล์</th>
              <th>ผู้อัปโหลด</th>
              <th>พรีวิว</th>
              <th>สถานะ</th>
              <th className="text-right pr-6">จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((v, index) => (
              <tr
                key={v.id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4 text-center text-white/30">
                  {(page - 1) * PAGE_SIZE + index + 1}
                </td>

                <td className="font-medium text-white">{v.name}</td>

                <td className="text-sm text-white/60">
                  {v.uploader || "ระบบ"}
                </td>

                <td>
                  <button
                    onClick={() => playVoice(v.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition
                    ${playingId === v.id
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "bg-white/10 hover:bg-white/20"
                      }`}
                  >
                    {playingId === v.id ? <FaPause /> : <FaPlay />}
                    {playingId === v.id ? "หยุด" : "ฟังเสียง"}
                  </button>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${statusStyle[v.status]}`}
                  >
                    {v.status === "System"
                      ? "เสียงระบบ"
                      : v.status === "Pending"
                        ? "รอตรวจสอบ"
                        : v.status === "Approved"
                          ? "อนุมัติ"
                          : "ปฏิเสธ"}
                  </span>
                </td>

                <td className="text-right pr-6 space-x-4 text-sm">
                  <button
                    disabled={v.status === "System"}
                    onClick={() => updateStatus(v.id, "Approved")}
                    className={
                      v.status === "Approved"
                        ? "text-green-400 font-semibold"
                        : "text-white/50 hover:text-green-400"
                    }
                  >
                    อนุมัติ
                  </button>

                  <button
                    disabled={v.status === "System"}
                    onClick={() => updateStatus(v.id, "Rejected")}
                    className={
                      v.status === "Rejected"
                        ? "text-red-400 font-semibold"
                        : "text-white/50 hover:text-red-400"
                    }
                  >
                    ปฏิเสธ
                  </button>
                </td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-14 text-center text-white/40">
                  ไม่พบข้อมูลเสียง
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && (
          <div className="py-6 text-center text-white/40">
            กำลังโหลดข้อมูล...
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-30"
        >
          ก่อนหน้า
        </button>
        <button
          disabled={filtered.length <= 10}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-30"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}
