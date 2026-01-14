import { pool } from "../../../common/constants/db";

export const updateVoiceRef = async (
    userId: number,
    voiceRef: string,
    originalName: string,
) => {
    if (!userId || !voiceRef || !originalName) {
        throw new Error("Invalid parameters");
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. หา steamer_id
        const steamerRes = await client.query(
            `SELECT steamer_id FROM steamers_user WHERE user_id = $1`,
            [userId]
        );

        if (steamerRes.rowCount === 0) {
            throw new Error("Steamer not found");
        }

        const steamerId = steamerRes.rows[0].steamer_id;
        // 2. บันทึก voiceRef ลงตาราง voice_models
        const response = await client.query(
            `INSERT INTO voice_models (steamer_id, model_name,created_at,status,config_path)
         VALUES ($1, $2, NOW(), 0, $3)`,
            [steamerId, originalName, voiceRef]
        );

        await client.query("COMMIT");
        return response;
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("updateVoiceRef error:", err);
        throw err;
    } finally {
        client.release();
    }
};

export const getListVoiceUserById = async (userId: number) => {
    if (!userId) {
        throw new Error("Invalid parameters");
    }
    try {
        const steamerRes = await pool.query(
            `SELECT steamer_id FROM steamers_user WHERE user_id = $1`,
            [userId]
        );
        if (steamerRes.rowCount === 0) {
            throw new Error("Steamer not found");
        }
        const stemerId = steamerRes.rows[0].steamer_id;
        const response = await pool.query(
            `SELECT model_id, model_name, status , config_path FROM voice_models WHERE steamer_id = $1`,
            [stemerId]
        )
        const voiceDetails = response.rows.map(d => ({
            modelId: d.model_id,
            modelName: d.model_name,
            status: d.status,
            configPath: d.config_path,
        }));

        return voiceDetails;
    } catch (err) {
        throw err;
    }

}



export const useVoiceRef = async (userId: number, modelId: number) => {
    if (!userId || !modelId) {
        throw new Error('user or voiceRef not found')
    }

    try {
        const steamerRes = await pool.query(
            `SELECT steamer_id FROM steamers_user WHERE user_id = $1`,
            [userId]
        );
        if (steamerRes.rowCount === 0) {
            throw new Error("Steamer not found");
        }
        const steamerId = steamerRes.rows[0].steamer_id;

        const response = pool.query(`
           INSERT INTO setting_user (steamer_id, model_id)
           VALUES ($1, $2)
           ON CONFLICT (steamer_id)
           DO UPDATE SET model_id = EXCLUDED.model_id;
            `, [steamerId, modelId])

        return response;
    } catch (err) {
        throw err;
    }
}
export const deleteVoiceRef = async (userId: number, modelId: number) => {
    if (!userId || !modelId) {
        throw new Error('user or voiceRef not found')
    }
    const client = await pool.connect();
    try {

        await client.query("BEGIN");
        const steamerRes = await client.query(
            `SELECT steamer_id FROM steamers_user WHERE user_id = $1`,
            [userId]
        );

        if (steamerRes.rowCount === 0) {
            throw new Error("Steamer not found");
        }

        const steamerId = steamerRes.rows[0].steamer_id;

        await client.query(
            `UPDATE setting_user
            SET model_id = NULL
            WHERE model_id = $1
            AND steamer_id = $2`,
            [modelId, steamerId]
        );

        const response = await client.query(`
        DELETE FROM voice_models
        WHERE model_id = $1
        AND steamer_id = $2    
        `, [modelId, steamerId]);

        if (response.rowCount === 0) {
            throw new Error("Voice model not found or not owned by this user");
        }

        await client.query('COMMIT');

        return { success: true };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
}

export const getVoiceModelIsUse = async (userId: number) => {
    if (!userId) {
        throw new Error('User not found')
    }
    try {
        const steamerRes = await pool.query(
            `SELECT steamer_id FROM steamers_user WHERE user_id = $1`,
            [userId]
        );
        if (steamerRes.rowCount === 0) {
            throw new Error("Steamer not found");
        }
        const steamerId = steamerRes.rows[0].steamer_id;

        const response = await pool.query(`
        SELECT vm.model_id ,vm.config_path FROM voice_models vm
        join setting_user su on vm.model_id = su.model_id 
        where vm.steamer_id = $1
        `, [steamerId]);
        const fileName = response.rows[0]?.config_path;
        const modelId = response.rows[0]?.model_id
        const result = {
            fileName: fileName ? fileName : 'temp_short_ref.wav',
            modelId: modelId
        }
        return result;
    } catch (err) {
        throw err;
    }
}