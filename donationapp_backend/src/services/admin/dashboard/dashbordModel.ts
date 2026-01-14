import { pool } from "../../../common/constants/db";

export type DashboardStats = {
  totalUsers: number;
  totalVoices: number;
  pendingVoices: number;
  bannedWords: number;
  bannedUsers: number;
};

type Row = { total: number };

export async function getDashboardStats(): Promise<DashboardStats> {
  const totalUsers = await pool.query<Row>(
    "SELECT COUNT(*)::int AS total FROM users"
  );

  const bannedUsers = await pool.query<Row>(
    "SELECT COUNT(*)::int AS total FROM users WHERE status = 0"
  );

  const bannedWords = await pool.query<Row>(
    "SELECT COUNT(*)::int AS total FROM admin_global_word_filter"
  );

  const totalVoices = await pool.query<Row>(
    "SELECT COUNT(*)::int AS total FROM voice_models"
  );

  const pendingVoices = await pool.query<Row>(
    "SELECT COUNT(*)::int AS total FROM voice_models WHERE status IS NULL OR status <> 1"
  );

  return {
    totalUsers: totalUsers.rows[0].total,
    totalVoices: totalVoices.rows[0].total,
    pendingVoices: pendingVoices.rows[0].total,
    bannedWords: bannedWords.rows[0].total,
    bannedUsers: bannedUsers.rows[0].total,
  };
}
