import { pool } from "../../../common/constants/db";

export const getAllWordFilter = async () => {
  const result = await pool.query(
    `
    SELECT id, word, created_at
    FROM admin_global_word_filter
    ORDER BY created_at DESC
    `
  );
  return result.rows;
};

export const addWordFilter = async (word: string) => {
  const normalizedWord = word.trim().toLowerCase();

  const result = await pool.query(
    `
    INSERT INTO admin_global_word_filter (word)
    VALUES ($1)
    ON CONFLICT (word) DO NOTHING
    RETURNING *
    `,
    [normalizedWord]
  );

  return result.rows[0] ?? null;
};

export const deleteWordFilter = async (word: string) => {
  const normalizedWord = word.trim().toLowerCase();

  const result = await pool.query(
    `
    DELETE FROM admin_global_word_filter
    WHERE word = $1
    RETURNING *
    `,
    [normalizedWord]
  );

  return result.rows[0] ?? null;
};
