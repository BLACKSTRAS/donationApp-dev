import { pool } from "../../../common/constants/db";
import { ResponseMessage } from "../../../common/constants/responMessage";

export const submitMinAmout = async (
    userId: number,
    minAmout: number
) => {
    try {
        const response = await pool.query(`
           UPDATE steamers_user
           SET min_donation = $2
           WHERE user_id = $1
            `, [userId, minAmout]);
        return response;
    } catch (err) {
        throw err;
    }
}

export const addWordFilter = async (
    userId: number,
    words: string
) => {
    try {
        const steamerRes = await pool.query(
            `SELECT steamer_id FROM steamers_user WHERE user_id = $1`,
            [userId]
        );

        if (steamerRes.rowCount === 0) {
            throw new Error(ResponseMessage.USER_EMPTY);
        }

        const steamerId = steamerRes.rows[0].steamer_id;

        const response = await pool.query(`
            INSERT INTO setting_user (steamer_id, word_filter)
            VALUES ($1, ARRAY[$2])
            ON CONFLICT (steamer_id)
            DO UPDATE 
            SET word_filter = array_append(setting_user.word_filter, $2)
            RETURNING *
        `, [steamerId, words]);

        return response.rows[0];
    } catch (err) {
        console.error("addWordFilter error:", err);
        throw err;
    }
}

export const addWordWithDonate = async (
    userId: number,
    words: string
) => {
    try {
        const steamerRes = await pool.query(
            `SELECT steamer_id FROM steamers_user WHERE user_id = $1`,
            [userId]
        );

        if (steamerRes.rowCount === 0) {
            throw new Error(ResponseMessage.USER_EMPTY);
        }

        const steamerId = steamerRes.rows[0].steamer_id;
        const rawWord = words?.trim();

        const response = await pool.query(`
            INSERT INTO setting_user (steamer_id, text_with_donate)
            VALUES ($1, $2)
            ON CONFLICT (steamer_id)
            DO UPDATE 
            SET text_with_donate = EXCLUDED.text_with_donate
            RETURNING *
        `, [steamerId, rawWord]);

        return response.rows[0];
    } catch (err) {
        console.error("addWordWithDonate error:", err);
        throw err;
    }
}
export const deleteWordFilter = async (
    userId: number,
    word: string
) => {
    try {
        if (!word || !word.trim()) {
            throw new Error("คำกรองไม่ถูกต้อง");
        }

        const trimmedWord = word.trim();

        const steamerRes = await pool.query(
            `SELECT steamer_id FROM steamers_user WHERE user_id = $1`,
            [userId]
        );

        if (steamerRes.rowCount === 0) {
            throw new Error(ResponseMessage.USER_EMPTY);
        }

        const steamerId = steamerRes.rows[0].steamer_id;

        const response = await pool.query(`
            UPDATE setting_user
            SET word_filter = array_remove(word_filter, $2)
            WHERE steamer_id = $1
            RETURNING *
        `, [steamerId, trimmedWord]);

        if (response.rowCount === 0) {
            throw new Error("ไม่พบข้อมูล");
        }

        return response.rows[0];

    } catch (err) {
        console.error("deleteWordFilter error:", err);
        throw err;
    }
};
