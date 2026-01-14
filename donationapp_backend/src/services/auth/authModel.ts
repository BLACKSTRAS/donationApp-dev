import { ResponseMessage } from '../../common/constants/responMessage';
import { pool } from '../../common/constants/db';
import crypto from "crypto";

/* การทำงานเกี่ยวกับ transaction ของ database เอามาทำตรงนี้ */
export const creatNewUser = async (username: string, email: string, password: string) => {
    const client = await pool.connect();
    const widgetToken = crypto.randomUUID(); 
    try {
        await client.query('BEGIN');
        const newUser = await client.query(
            'INSERT INTO users (user_name,email,password,role,create_date) VALUES ($1,$2,$3,$4,NOW()) RETURNING *',
            [username, email, password, "steamer"]
        ); /* สร้าง query สำหรับนำเข้า database */

        const userId = newUser.rows[0].user_id;

        const newSteamer = await client.query(
            'INSERT INTO steamers_user (user_id,widget_token) VALUES ($1,$2) RETURNING *',
            [userId,widgetToken]
        ); /* สร้าง query สำหรับนำเข้า database */

        await client.query('COMMIT');
        return { user: newUser.rows[0], steamer: newSteamer.rows[0] };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }

}