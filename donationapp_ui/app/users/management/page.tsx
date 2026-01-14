"use client";

import React, { useEffect, useMemo, useState } from "react";
import Manubars from "@/components/Menubar_users";
import DonationHistoryChart from "@/components/DonationChart";
import { useAuth } from "@/components/AuthProvider";

const API_BASEURL = process.env.NEXT_PUBLIC_API_BASEURL;

type RangeKey = "7d" | "30d" | "1y" | "all";

type DonationRow = {
  donate_id: number;
  donate_at: string | null;
  donate_by: string | null;
  donate_details: string | null;
  amout: number;
  payment_type: string;
  status: string;
};

type DashboardRes = {
  message: string;
  /* สำรหับ input ด้านบน */
  stats: {
    todayIncome: number;
    totalIncome: number;
    todayDonationCount: number;
    totalDonationCount: number;
    todayMessageCount: number;
    totalMessageCount: number;
  };
  /* สำหรับส่งไปยัง chart */
  donations: DonationRow[];
};

type StatCardVariant = "soft" | "primary";
interface CardConfig {
  label: string;
  amount: number | string;
  unit?: string;
  variant: StatCardVariant;
}

const Management = () => {
  const [range, setRange] = useState<RangeKey>("all");
  const [donations, setDonations] = useState<DonationRow[]>([]);
  const [stats, setStats] = useState({
    todayIncome: 0,
    totalIncome: 0,
    todayDonationCount: 0,
    totalDonationCount: 0,
    todayMessageCount: 0,
    totalMessageCount: 0,
  });

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASEURL}/manage/dashboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ range }),
          credentials: "include",
        });

        if (!res.ok) throw new Error("fetch dashboard failed");

        const data = (await res.json()) as DashboardRes;

        setStats(data.stats);
        setDonations(data.donations ?? []);
      } catch (e) {
        console.error(e);
      }
    };

    run();
  }, [range]);

  const cards: CardConfig[] = useMemo(
    () => [
      {
        label: "ยอดการรับเงินวันนี้",
        amount: stats.todayIncome,
        unit: "บาท",
        variant: "soft",
      },
      {
        label: "ยอดการรับเงินทั้งหมด",
        amount: stats.totalIncome,
        unit: "บาท",
        variant: "primary",
      },
      {
        label: "จำนวนโดเนทวันนี้",
        amount: stats.todayDonationCount,
        unit: "ครั้ง",
        variant: "soft",
      },
      {
        label: "จำนวนโดเนททั้งหมด",
        amount: stats.totalDonationCount,
        unit: "ครั้ง",
        variant: "primary",
      },
    ],
    [stats]
  );
  const auth = useAuth();
  if (!auth) return null; // กัน prerender
  const { user } = auth;
  const userName = user?.userName;

  return (
    <div className="min-h-screen text-white">
      <div className="flex max-w-7xl mx-auto mb-auto h-full pb-10">
        <div className="pt-20 pr-6">
          <Manubars />
        </div>

        <div className="flex-1 pt-16 pl-6">
          <div>
            <h1 className="text-3xl font-semibold mb-1">
              เราจะช่วยคุณสรุปยอดเอง!
            </h1>

            <p className="mb-6 text-white/60">
              ยินดีต้อนรับ,
              <span className="text-white font-semibold ml-1">{userName}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`relative h-[140px] rounded-2xl border border-white/10 
                shadow-[0_0_35px_rgba(0,0,0,0.6)] p-4 flex flex-col justify-between
                bg-gradient-to-br ${
                  card.variant === "soft"
                    ? "from-[#020617] via-[#02091F] to-[#010314]"
                    : "from-[#0A0F2D] via-[#081A42] to-[#03071C]"
                }`}
              >
                <div
                  className={`inline-flex w-fit items-center px-3 py-[2px] rounded-full text-xs
                    ${
                      card.variant === "soft"
                        ? "bg-white/10 border border-white/15 text-white/80"
                        : "bg-gradient-to-r from-[#5E84FF] to-[#005EFF] text-white font-medium shadow-md"
                    }`}
                >
                  {card.label}
                </div>

                <div className="text-4xl leading-none text-white font-semibold">
                  {card.amount}{" "}
                  <span className="text-2xl font-normal text-white/80">
                    {card.unit || ""}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <DonationHistoryChart
            donations={donations.map((d) => ({
              donate_at: d.donate_at ?? "",
              donate_details: d.donate_details,
              amout: d.amout,
            }))}
            range={range}
            onChangeRange={setRange}
          />
        </div>
      </div>
    </div>
  );
};

export default Management;
