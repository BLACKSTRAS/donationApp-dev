// src/services/user/Histories/DonateHistoryModel.ts
import { pool } from "../../../common/constants/db";

export const getDonateHistories = async (
  steamerId: number, // steamer_user.steamer_id
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;
  const params: number[] = [];

  // JOIN กับ steamers_user โดยเทียบ donations.steamer_id = steamers_user.steamer_id
  let dataQuery = `
    SELECT d.donate_id, d.donate_at, d.donate_by, d.donate_details,
           d.amout, d.payment_type, d.status
    FROM donations d 
    JOIN steamers_user s ON d.steamer_id = s.steamer_id
    JOIN users u ON s.user_id = u.user_id 
  `;

  if (steamerId) {
    dataQuery += ` WHERE u.user_id = $1`;
    params.push(steamerId);
  }

  dataQuery += ` ORDER BY d.donate_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const countQuery = steamerId
    ? `SELECT COUNT(*) FROM donations d JOIN steamers_user s ON d.steamer_id = s.steamer_id JOIN users u ON s.user_id = u.user_id WHERE u.user_id = $1`
    : `SELECT COUNT(*) FROM donations d JOIN steamers_user s ON d.steamer_id = s.steamer_id JOIN users u ON s.user_id = u.user_id`;
  const countParams = steamerId ? [steamerId] : [];

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, params),
    pool.query(countQuery, countParams),
  ]);

  return {
    items: dataResult.rows,
    total: Number(countResult.rows[0].count),
  };
};