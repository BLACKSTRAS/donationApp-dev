import { pool } from "../../../common/constants/db";

export const UsersModel = {
  async getAll(search: string, limit: number, offset: number) {
    const sql = `
    SELECT
      u.user_id,
      u.user_name,
      u.email,
      u.role,
      u.status,             
      u.create_date,
      u.image_user,
      su.steamer_id,
      COUNT(d.donate_id) AS donate_count,
      COALESCE(SUM(d.amout), 0) AS donate_total
    FROM users u
    LEFT JOIN steamers_user su ON su.user_id = u.user_id
    LEFT JOIN donations d ON d.steamer_id = su.steamer_id
    WHERE
      u.user_name ILIKE $1
      OR u.email ILIKE $1
    GROUP BY
      u.user_id,
      u.user_name,
      u.email,
      u.role,
      u.status,              
      u.create_date,
      u.image_user,
      su.steamer_id
    ORDER BY u.create_date DESC
    LIMIT $2 OFFSET $3
  `;

    const { rows } = await pool.query(sql, [`%${search}%`, limit, offset]);

    return rows;
  },

  async getById(userId: number) {
    const sql = `
      SELECT
        u.*,
        su.*,
        s.*
      FROM users u
      LEFT JOIN steamers_user su ON su.user_id = u.user_id
      LEFT JOIN setting_user s ON s.steamer_id = su.steamer_id
      WHERE u.user_id = $1
    `;

    const { rows } = await pool.query(sql, [userId]);
    return rows[0];
  },

  async updateRole(userId: number, role: "admin" | "steamer") {
    await pool.query(`UPDATE users SET role = $1 WHERE user_id = $2`, [
      role,
      userId,
    ]);
  },

  async updateStatus(userId: number, status: "1" | "0") {
    await pool.query(`UPDATE users SET status = $1 WHERE user_id = $2`, [
      status,
      userId,
    ]);
  },
};
