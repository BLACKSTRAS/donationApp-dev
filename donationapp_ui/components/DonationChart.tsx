"use client";

import { DAY_MAP, MONTH_MAP } from "@/constants/days";
import { ChartRow, DonationHistoryChartProps, listDay, listMonth, RangeKey } from "@/constants/models";
import { mapDataByRang } from "@/libs/mapDataChart";
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatNumber(n: number) {
  return new Intl.NumberFormat("th-TH").format(n);
}

export default function DonationHistoryChart({
  donations,
  range,
  onChangeRange,
}: DonationHistoryChartProps) {
  const chartData: ChartRow[] = useMemo(() => {
    const data: ChartRow[] = mapDataByRang(donations, range);
    return data
  }, [donations]);

  return (
    <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold">ประวัติการโดเนท</h2>
          <p className="text-xs text-white/60">ยอดเงินต่อวัน</p>
        </div>

        <div className="flex rounded-full border border-white/10 bg-black/40 p-1 text-xs">
          {[
            { key: "7d", label: "7 วัน" },
            { key: "30d", label: "30 วัน" },
            { key: "1y", label: "รายปี" },
            { key: "all", label: "ทั้งหมด" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onChangeRange(item.key as RangeKey)}
              className={`px-4 py-2 rounded-full transition ${range === item.key
                ? "bg-white text-black"
                : "text-white/70 hover:bg-white/10"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#ffffff10" vertical={false} />

            <XAxis
              dataKey="label"
              tick={{ fill: "#ffffff70", fontSize: 11 }}
              interval="preserveStartEnd"
              angle={0}
            />

            <YAxis tick={{ fill: "#ffffff70", fontSize: 11 }} />

            <Tooltip
              cursor={{ fill: "#ffffff08" }}
              content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const data = payload[0].payload as ChartRow;
                return (
                  <div className="p-3 rounded-xl bg-[#0b1020] border border-white/20 shadow-lg text-xs">
                    <div className="text-white font-semibold mb-2">
                      {data.label}
                    </div>
                    <div className="text-purple-300">
                      จำนวนโดเนท : {formatNumber(data.count)} ครั้ง
                    </div>
                    <div className="text-blue-300">
                      จำนวนเงิน : {formatNumber(data.total)} บาท
                    </div>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="total"
              fill="#5E84FF"
              radius={[8, 8, 0, 0]}
              name="จำนวนเงิน"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
