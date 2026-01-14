"use client";

import Manubars from "@/components/Menubar_users";
import React, { useEffect, useMemo, useState } from "react";
import { DonationRes } from "@/constants/models";
import { getDonateHistory } from "@/services/users/userInfo";
const headers = [
  { key: "donate_at", label: "เวลาที่โดเนท" },
  { key: "donate_by", label: "ชื่อผู้ใช้" },
  { key: "donate_details", label: "ข้อความ" },
  { key: "amout", label: "จำนวนเงิน" },
  { key: "payment_type", label: "ช่องทางการบริจาค" },
  { key: "status", label: "สถานะ" },
  { key: "action", label: "การทำงาน" },
] as const;

function fmtDateTimeTH(v: string | null) {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtMoney(v: string) {
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return n.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const gridCols = "grid-cols-[160px_140px_1fr_140px_200px_120px_110px]";

const DonateHistorypage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DonationRes | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [sortBy] = useState<
    "donate_at" | "donate_by" | "amout" | "payment_type" | "status"
  >("donate_at");
  const [sortDir] = useState<"asc" | "desc">("desc");

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("limit", String(pageSize));
    p.set("sortBy", sortBy);
    p.set("sortDir", sortDir);
    return p.toString();
  }, [page, pageSize, sortBy, sortDir]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const json = await getDonateHistory({
          page,
          limit: pageSize,
          sortBy,
          sortDir,
        })

        if (!alive || !json) return;
        setData({
          page: json.page ?? page,
          total: json.total ?? 0,
          totalPages: json.totalPages ?? 1,
          items: Array.isArray(json.items) ? json.items : [],
          limit: json.limit,
          pageSize: (json as any).pageSize ?? json.limit ?? pageSize,
        });
      } catch {
        if (!alive) return;
        setData({
          page,
          pageSize,
          total: 0,
          totalPages: 1,
          items: [],
        });
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [queryString, page, pageSize]);

  const totalPages = data?.totalPages ?? 1;
  const hasRows = (data?.items?.length || 0) > 0;

  return (
    <div className="min-h-full text-white">
      <div className="flex max-w-7xl mx-auto h-full pb-10">
        <div className="pt-20 pr-6">
          <Manubars />
        </div>

        <div className="flex-1 pt-16 pl-6 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#5E84FF] to-[#005EFF]">
            <div className={`grid ${gridCols} items-center px-4`}>
              {headers.map((h) => (
                <div
                  key={h.key}
                  className="
                    py-4
                    text-sm font-semibold
                    text-white
                    flex items-center gap-1
                    select-none
                  "
                >
                  <span className="truncate">{h.label}</span>

                  {h.key !== "action" && h.key !== "donate_details" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className="size-3 text-white/80"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 9l-7.5 7.5L4.5 9"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/0 overflow-hidden">
            <div className="max-h-full overflow-auto">
              {loading ? (
                <div className="p-10 text-white/60">กำลังโหลด...</div>
              ) : !hasRows ? (
                <div className="h-[420px] flex items-center justify-center">
                  <div className="text-white/25 text-sm">
                    ยังไม่มีข้อมูลประวัติการโดเนท
                  </div>
                </div>
              ) : (
                <div className="w-full text-sm">
                  {data!.items?.map((row, idx) => (
                    <div
                      key={row.donate_id}
                      className={[
                        `grid ${gridCols} items-center px-4`,
                        idx % 2 === 0 ? "bg-white/0" : "bg-white/5",
                        "border-b border-white/10",
                      ].join(" ")}
                    >
                      <div className="py-4">{fmtDateTimeTH(row.donate_at)}</div>

                      <div className="py-4 truncate">
                        {row.donate_by || "-"}
                      </div>

                      <div className="py-4 truncate">
                        {row.donate_details || "-"}
                      </div>

                      <div className="py-4">{fmtMoney(row.amout)}</div>

                      <div className="py-4 truncate">{row.payment_type}</div>

                      <div className="py-4">{row.status}</div>

                      <div className="py-4">
                        <button
                          className="
                            w-full
                            px-3 py-2
                            rounded-lg
                            border border-white/10
                            bg-white/5
                            hover:bg-white/10
                            transition
                          "
                        >
                          ดู
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div
                className="
                  flex items-center gap-1
                  rounded-full px-2 py-1
                  border border-white/20
                  bg-gradient-to-r from-[#5E84FF] to-[#005EFF]
                  shadow-[0_6px_18px_rgba(0,0,0,0.35)]
                  backdrop-blur-sm
                "
              >
                {(() => {
                  const btn =
                    "h-9 w-9 rounded-full flex items-center justify-center " +
                    "text-white/95 hover:bg-white/15 active:bg-white/20 transition " +
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 " +
                    "disabled:opacity-40 disabled:cursor-not-allowed";

                  const icon = "size-5";

                  return (
                    <>
                      <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setPage(1)}
                        className={btn}
                        aria-label="First page"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className={icon}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                          />
                        </svg>
                      </button>

                      <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={btn}
                        aria-label="Previous page"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className={icon}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5 8.25 12l7.5-7.5"
                          />
                        </svg>
                      </button>

                      <span className="mx-1 h-5 w-px bg-white/20" />

                      <div className="px-3 text-sm font-semibold text-white/95 select-none">
                        หน้า {page}
                        <span className="text-white/70 font-medium">
                          {" "}
                          / {totalPages}
                        </span>
                      </div>

                      <span className="mx-1 h-5 w-px bg-white/20" />

                      <button
                        type="button"
                        disabled={page === totalPages}
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={btn}
                        aria-label="Next page"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className={icon}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>

                      <button
                        type="button"
                        disabled={page === totalPages}
                        onClick={() => setPage(totalPages)}
                        className={btn}
                        aria-label="Last page"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className={icon}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          <div className="mt-2 text-xs text-white/40">
            {data ? `ทั้งหมด ${data.total} รายการ` : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateHistorypage;
