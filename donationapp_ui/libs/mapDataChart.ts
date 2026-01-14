import { DAY_MAP, MONTH_MAP } from "@/constants/days";
import { ChartRow, DonationLite, listDay, listMonth, objectData, RangeKey } from "@/constants/models";

export function mapDataByRang(donation: DonationLite[], rang: RangeKey): ChartRow[] {
  if (!donation || !rang) return [];

  switch (rang) {
    case "7d": {
      const result: Record<listDay, objectData> = {
        Sun: { total: 0, count: 0 },
        Mon: { total: 0, count: 0 },
        Tue: { total: 0, count: 0 },
        Wed: { total: 0, count: 0 },
        Thu: { total: 0, count: 0 },
        Fri: { total: 0, count: 0 },
        Sat: { total: 0, count: 0 },
      };

      const now = new Date();
      const start = new Date();
      start.setDate(now.getDate() - 6);

      donation.forEach((item) => {
        const date = new Date(item.donate_at);

        if (date >= start && date <= now) {
          const dayKey = DAY_MAP[date.getDay()];
          result[dayKey].total += item.amout;
          result[dayKey].count += 1;
        }
      });
      return DAY_MAP.map((day) => ({
        label: day,
        total: result[day].total,
        count: result[day].count,
      }));
    }
    case "30d": {
      const result: Record<number, objectData> = {};
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      donation.forEach((item) => {
        const date = new Date(item.donate_at);

        // ✅ กรองเฉพาะเดือน + ปีปัจจุบัน
        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        ) {
          const day = date.getDate();

          if (!result[day]) {
            result[day] = { total: 0, count: 0 };
          }

          result[day].total += item.amout;
          result[day].count += 1;
        }
      });

      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;

        return {
          label: day.toString(),
          total: result[day]?.total || 0,
          count: result[day]?.count || 0,
        };
      });
    }
    case "1y": {
      const result: Record<listMonth, objectData> = {
        Jan: { total: 0, count: 0 }, Feb: { total: 0, count: 0 }, Mar: { total: 0, count: 0 },
        Apr: { total: 0, count: 0 }, May: { total: 0, count: 0 }, Jun: { total: 0, count: 0 },
        Jul: { total: 0, count: 0 }, Aug: { total: 0, count: 0 }, Sep: { total: 0, count: 0 },
        Oct: { total: 0, count: 0 }, Nov: { total: 0, count: 0 }, Dec: { total: 0, count: 0 },
      };

      const currentYear = new Date().getFullYear();

      donation.forEach((item) => {
        const date = new Date(item.donate_at);

        if (date.getFullYear() === currentYear) {
          const monthKey = MONTH_MAP[date.getMonth()];
          result[monthKey].total += item.amout;
          result[monthKey].count += 1;
        }
      });

      return MONTH_MAP.map((month) => ({
        label: month,
        total: result[month].total,
        count: result[month].count,
      }));
    }
    case "all": {
      const result: Record<number, objectData> = {};
      const now = new Date();
      const currentYear = now.getFullYear();
      const startYear = currentYear - 4;

      for (let y = startYear; y <= currentYear; y++) {
        result[y] = { total: 0, count: 0 };
      }

      donation.forEach((item) => {
        const date = new Date(item.donate_at);
        const year = date.getFullYear();

        if (!result[year]) {
          result[year] = { total: 0, count: 0 };
        }
        result[year].total += item.amout;
        result[year].count += 1;
      });

      return Object.keys(result)
        .sort((a, b) => Number(a) - Number(b))
        .map((year) => ({
          label: year,
          total: result[Number(year)].total,
          count: result[Number(year)].count
        }));
    }

  }
}