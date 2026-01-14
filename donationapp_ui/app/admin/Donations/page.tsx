"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASEURL;
const PAGE_SIZE = 8;

type WordItem = {
  id: number;
  word: string;
  created_at: string;
};

export default function DonationsPage() {
  const toast = useRef<Toast>(null);

  const [items, setItems] = useState<WordItem[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const showError = (errorMessage?: string) => {
    toast.current?.show({
      severity: "error",
      summary: "พบข้อผิดพลาด",
      detail: errorMessage ?? "ติดต่อผู้ดูแลระบบ",
      life: 3000,
    });
  };

  const showSuccess = (successMessage?: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: successMessage ?? "",
      life: 3000,
    });
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/donations/word-filter`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setItems(data?.data || []);
      } catch {
        showError("โหลดข้อมูลไม่สำเร็จ");
      }
    };

    fetchWords();
  }, []);

  const addWord = async () => {
    const value = input.trim().toLowerCase();
    if (!value) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/donations/word-filter`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: value }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || "เพิ่มคำต้องห้ามไม่สำเร็จ");
        return;
      }

      showSuccess(data.message || "เพิ่มคำต้องห้ามสำเร็จ");
      setInput("");
      const refreshRes = await fetch(
        `${API_BASE}/admin/donations/word-filter`,
        {
          credentials: "include",
        }
      );
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setItems(refreshData?.data || []);
      }
    } catch {
      showError("เพิ่มคำต้องห้ามไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const removeWord = async (word: string) => {
    const ok = window.confirm(`ลบคำ "${word}" ใช่หรือไม่`);
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/admin/donations/word-filter/${encodeURIComponent(word)}`,
        { method: "DELETE", credentials: "include" }
      );

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || "ลบคำต้องห้ามไม่สำเร็จ");
        return;
      }

      showSuccess(data.message || "ลบคำต้องห้ามสำเร็จ");
      const refreshRes = await fetch(
        `${API_BASE}/admin/donations/word-filter`,
        {
          credentials: "include",
        }
      );
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setItems(refreshData?.data || []);
      }
    } catch {
      showError("ลบคำต้องห้ามไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return items.filter((i) =>
      i.word.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="space-y-6 max-w-full relative">
      <Toast ref={toast} position="top-right" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-cyan-400">
            ควบคุมระบบโดเนท
          </h2>
          <p className="text-sm text-white/50">Global banned words (Admin)</p>
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาคำต้องห้าม"
          className="w-full h-11 rounded-md bg-[#020617] px-4 text-sm outline-none border border-white/10 focus:border-cyan-400"
        />
      </div>

      <div className="bg-[#0A1635] p-6 rounded-xl border border-white/10">
        <p className="text-sm text-white/60">จำนวนคำต้องห้าม</p>
        <p className="text-3xl font-bold text-cyan-400 mt-2">{items.length}</p>
      </div>

      <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="เพิ่มคำต้องห้าม"
            className="flex-1 h-11 rounded-md bg-[#020617] px-4 text-sm outline-none border border-white/10 focus:border-cyan-400"
          />
          <button
            onClick={addWord}
            disabled={loading}
            className="px-5 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
          >
            เพิ่ม
          </button>
        </div>

        {paged.length === 0 ? (
          <div className="text-center py-10 text-sm text-white/40">
            ไม่พบคำต้องห้าม
          </div>
        ) : (
          <ul className="space-y-2">
            {paged.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-black/30 px-4 py-2 rounded-lg"
              >
                <div>
                  <p className="text-sm">{item.word}</p>
                  <p className="text-xs text-white/40">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeWord(item.word)}
                  disabled={loading}
                  className="text-red-400 text-sm hover:underline disabled:opacity-50"
                >
                  ลบ
                </button>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded text-sm ${
                  page === i + 1
                    ? "bg-cyan-500 text-black"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
