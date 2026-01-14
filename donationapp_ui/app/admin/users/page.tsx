"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASEURL;
const PAGE_SIZE = 10;

type UserRole = "admin" | "steamer";
type UserStatus = 1 | 0;

type User = {
  user_id: number;
  user_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const reloadPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/users?search=${search}&page=${page}&limit=${PAGE_SIZE}`,
          { credentials: "include" }
        );
        const json = await res.json();
        setUsers(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [search, page]);

  const changeRole = async (user: User) => {
    const nextRole: UserRole = user.role === "admin" ? "steamer" : "admin";
    const ok = confirm(`ยืนยันเปลี่ยนสิทธิ์เป็น ${nextRole.toUpperCase()} ?`);
    if (!ok) return;

    await fetch(`${API_BASE}/users/${user.user_id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role: nextRole }),
    });

    reloadPage();
  };

  const toggleBan = async (user: User) => {
    const nextStatus: UserStatus = user.status === 1 ? 0 : 1;

    await fetch(`${API_BASE}/users/${user.user_id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: nextStatus }),
    });

    reloadPage();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-cyan-400">
          จัดการบัญชีผู้ใช้
        </h2>
        <p className="text-sm text-white/50">
          Manage users, roles and permissions
        </p>
      </div>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
        <input
          type="text"
          placeholder="ค้นหาชื่อผู้ใช้..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full h-10 rounded-md bg-[#020617] px-4 outline-none text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full bg-white/5">
          <thead className="bg-white/10 text-left text-sm">
            <tr>
              <th className="p-4 w-16 text-center">#</th>
              <th>ผู้ใช้</th>
              <th>อีเมล</th>
              <th>Role</th>
              <th>สถานะ</th>
              <th className="text-right pr-6">การจัดการ</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => {
              const no = (page - 1) * PAGE_SIZE + index + 1;

              return (
                <tr
                  key={u.user_id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4 text-center text-white/60">{no}</td>

                  <td className="flex-1 gap-3">
                    <span>{u.user_name}</span>
                  </td>

                  <td className="text-sm text-white/60">{u.email}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.status === 1
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {u.status === 1 ? "ใช้งานอยู่" : "ถูกระงับ"}
                    </span>
                  </td>

                  <td className="text-right pr-6 space-x-3 text-sm">
                    <button
                      onClick={() => changeRole(u)}
                      className="text-purple-400 hover:underline"
                    >
                      {u.role === "admin" ? "ลดเป็นผู้ใช้" : "ตั้งเป็นแอดมิน"}
                    </button>

                    <button
                      onClick={() => toggleBan(u)}
                      className={
                        u.status === 1
                          ? "text-yellow-400 hover:underline"
                          : "text-green-400 hover:underline"
                      }
                    >
                      {u.status === 1 ? "แบน" : "ปลดแบน"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-white/40">
                  ไม่พบผู้ใช้
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && (
          <div className="py-6 text-center text-white/40">กำลังโหลด...</div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded bg-white/10 disabled:opacity-40"
        >
          ก่อนหน้า
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded bg-white/10"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}
