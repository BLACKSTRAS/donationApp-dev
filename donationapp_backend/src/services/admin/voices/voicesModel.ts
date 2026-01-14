import { pool } from "../../../common/constants/db";

export type VoiceRow = {
  model_id: number;
  model_name: string;
  steamer_id: number | null;
  config_path: string;
  status: number;
  user_name: string | null;
};

export async function getVoices(search: string, page: number, limit: number) {
  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `
    SELECT
      vm.model_id,
      vm.model_name,
      vm.status,
      vm.config_path,
      u.user_name
    FROM voice_models vm
    LEFT JOIN steamers_user su ON vm.steamer_id = su.steamer_id
    LEFT JOIN users u ON su.user_id = u.user_id
    WHERE vm.model_name ILIKE $1
    ORDER BY vm.model_id DESC
    LIMIT $2 OFFSET $3
    `,
    [`%${search}%`, limit, offset]
  );

  return rows;
}

export async function getVoiceByModelId(modelId: number) {
  const { rows } = await pool.query(
    `
    SELECT
      model_id,
      model_name,
      status,
      config_path
    FROM voice_models
    WHERE model_id = $1
    `,
    [modelId]
  );

  return rows[0] ?? null;
}

export async function updateVoiceStatus(modelId: number, status: number) {
  await pool.query(`UPDATE voice_models SET status = $1 WHERE model_id = $2`, [
    status,
    modelId,
  ]);
}
