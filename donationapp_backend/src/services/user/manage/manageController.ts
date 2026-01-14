import { Request, Response } from "express";
import { pool } from "../../../common/constants/db";
import { ResponseMessage } from "../../../common/constants/responMessage";
import { ManagerInfo } from "../../../common/interface/authInterface";

type RangeKey = "7d" | "30d" | "1y" | "all";

function rangeToSQL(range: RangeKey) {

  switch (range) {
    case "7d":
      return {
        where: `AND d.donate_at >= NOW() - INTERVAL '7 days'`,
        extraParams: [] as any[],
      };
    case "30d":
      return {
        where: `AND d.donate_at >= NOW() - INTERVAL '30 days'`,
        extraParams: [] as any[],
      };
    case "1y":
      return {
        where: `AND d.donate_at >= NOW() - INTERVAL '1 year'`,
        extraParams: [] as any[],
      };
    case "all":
    default:
      return { where: ``, extraParams: [] as any[] };
  }
}

export const getToltalAmout = async (req: ManagerInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const result = await pool.query(
      `SELECT COALESCE(SUM(d.amout),0) AS totalamout
      FROM donations d
      JOIN steamers_user s ON d.steamer_id = s.steamer_id
      JOIN users u ON s.user_id = u.user_id
      WHERE u.user_id = $1`,
      [userId]
    );

    return res.status(200).json({
      message: ResponseMessage.SUCCESS_DATA,
      totalAmout: Number(result.rows[0]?.totalamout ?? 0),
    });
  } catch (err) {
    return res.status(500).json({ message: ResponseMessage.FAIL_DATA });
  }
};

export const getDashboard = async (req: ManagerInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }
  try {
    const userId = req.user.id;
    const range = (req.body?.range ?? "all") as RangeKey;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const statSql = `
      SELECT
        COALESCE(SUM(d.amout),0) AS total_income,
        COALESCE(SUM(
          CASE WHEN (d.donate_at AT TIME ZONE 'UTC')::date = (NOW() AT TIME ZONE 'UTC')::date
          THEN d.amout END
        ),0) AS today_income,
        COUNT(*) AS total_donation_count,
        COUNT(*) FILTER (
          WHERE (d.donate_at AT TIME ZONE 'UTC')::date = (NOW() AT TIME ZONE 'UTC')::date
        ) AS today_donation_count,
        COUNT(*) FILTER (WHERE d.donate_details IS NOT NULL AND d.donate_details <> '') AS total_message_count,
        COUNT(*) FILTER (
          WHERE d.donate_details IS NOT NULL AND d.donate_details <> ''
          AND (d.donate_at AT TIME ZONE 'UTC')::date = (NOW() AT TIME ZONE 'UTC')::date
        ) AS today_message_count
      FROM donations d
      JOIN steamers_user s ON d.steamer_id = s.steamer_id
      JOIN users u ON s.user_id = u.user_id
      WHERE u.user_id = $1
    `;

    const statResult = await pool.query(statSql, [userId]);
    const statRow = statResult.rows[0] || {};

    const { where } = rangeToSQL(range);

    const listSql = `
      SELECT
        d.donate_id,
        d.donate_at,
        d.donate_by,
        d.donate_details,
        d.payment_type,
        d.status,
        d.amout
      FROM donations d
      JOIN steamers_user s ON d.steamer_id = s.steamer_id
      JOIN users u ON s.user_id = u.user_id
      WHERE u.user_id = $1
      ${where}
      ORDER BY d.donate_at ASC
    `;

    const listResult = await pool.query(listSql, [userId]);

    const donations = listResult.rows.map((r: any) => ({
      donate_id: Number(r.donate_id),
      donate_at: r.donate_at,
      donate_by: r.donate_by ?? null,
      donate_details: r.donate_details ?? null,
      payment_type: r.payment_type ?? "",
      status: r.status ?? "",
      amout: Number(r.amout ?? 0),
    }));

    return res.status(200).json({
      message: "SUCCESS",
      stats: {
        todayIncome: Number(statRow.today_income ?? 0),
        totalIncome: Number(statRow.total_income ?? 0),
        todayDonationCount: Number(statRow.today_donation_count ?? 0),
        totalDonationCount: Number(statRow.total_donation_count ?? 0),
        todayMessageCount: Number(statRow.today_message_count ?? 0),
        totalMessageCount: Number(statRow.total_message_count ?? 0),
      },
      donations,
    });
  } catch (err) {
    return res.status(500).json({ message: ResponseMessage.FAIL_DATA });
  }
};
