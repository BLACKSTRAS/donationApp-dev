import { pool } from "../../../common/constants/db";
import { ResponseMessage } from "../../../common/constants/responMessage";
import { UserInfo, UserInfoInterface } from "../../../common/interface/authInterface";
import { Response } from "express";

export const getUserInfo = async (req: UserInfo, res: Response) => {
    if (!req.user?.id) {
        return res.status(401).json({
            status: 401,
            message: ResponseMessage.FAIL_DATA,
        });
    }
    const userId = req.user.id;
    const query = `SELECT first_name as "firstName", 
    last_name as "lastName", email, role, user_name as "userName", image_user as "imageUser"
    FROM users WHERE user_id = $1`

    try {
        const result = await pool.query(query, [userId]);
        if (result.rowCount === 0) {
            throw new Error(ResponseMessage.USER_EMPTY);
        }
        const user = result.rows[0];
        const userInfo = {
            userName: user.userName ?? '',
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            email: user.email ?? '',
            role: user.role ?? '',
            imageUser: user.imageUser ?? '',
        }
        return res.status(200).json(userInfo)
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}