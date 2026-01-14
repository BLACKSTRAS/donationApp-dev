import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { ResponseMessage } from '../../common/constants/responMessage';
import { pool } from '../../common/constants/db'; /*  */
import bcrypt from 'bcrypt';
import { creatNewUser } from './authModel';
import { Request, Response } from 'express';
import { AuthInterface, CookieInfo } from '../../common/interface/authInterface';

dotenv.config(); /* ดึง config จากไฟล์ .env */

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax' as const,
    maxAge: 1000 * 60 * 60 * 24,
    path: '/'
};

const removeSession = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
};

const genarateToken = (id: string, role: string) => {
    return jwt.sign(
        { role }, // 👈 payload
        process.env.JWT_SECRET as string,
        {
            subject: id,
            expiresIn: "1d",
        }
    );
};
/* logic สร้าง user */
export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body as AuthInterface;  /* รับ parameter สำหรับสร้าง user */
    /* เช็คว่า parameter ที่รับมาเป็น null ไหม ถ้า null return 400 */
    if (!username || !email || !password) {
        return res.status(400).json({ message: ResponseMessage.INVALID_INPUT });
    }
    /* เช็คว่ามี username หรือ eamil อยู่ในระบบหรือยัง */
    const checkDuplicateUser = await pool.query('SELECT user_name, email FROM users WHERE user_name=$1 OR email=$2', [username, email]);
    if (checkDuplicateUser.rowCount! > 0) {
        if (checkDuplicateUser.rows[0].user_name === username) {
            return res.status(409).json({ message: ResponseMessage.USER_USERNAME_DUPLICATE, status: 409 });
        }
        if (checkDuplicateUser.rows[0].email === email) {
            return res.status(409).json({ message: ResponseMessage.USER_EMAIL_DUPLICATE, status: 409 });
        }
    }
    /* เข้ารหัส รหัสผ่านก่อนนำไปเก็บลง database */
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const creatUser = await creatNewUser(username, email, hashedPassword);
        if (!creatUser) {
            return res.status(400).json({ message: ResponseMessage.USER_REGISTER_FAILED, status: 400 });
        }
        const userId = String(creatUser.user.user_id);
        const role = creatUser.user.role;
        const token = genarateToken(userId, role);
        res.cookie('token', token, cookieOptions);
        return res.status(201).json({ message: ResponseMessage.USER_REGISTER_SUCCESS, user: creatUser.user, status: 201 });
    } catch (err) {
        return res.status(500).json({ message: ResponseMessage.USER_REGISTER_FAILED, status: 500 });
    }
}

/* logic ล็อกอิน user */
export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body as AuthInterface;
    if (!username || !password) {
        return res.status(400).json({ message: ResponseMessage.INVALID_INPUT, status: 400 });
    }
    try {
        const userResult = await pool.query('SELECT user_id,role,status,password FROM users WHERE user_name = $1 OR email = $1', [username])
        console.log(userResult.rows[0])
        if (userResult.rowCount === 0) {
            return res.status(401).json({ message: ResponseMessage.USER_EMPTY, status: 401 });
        }
        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        const status = user?.status;
        if (!isPasswordValid) {
            return res.status(401).json({ message: ResponseMessage.USER_PASSWORD_INVALID, status: 401 });
        }
        if(status !== 1){
            return res.status(401).json({ message: "สถานะบัญชีถูกระงับ กรุณาติดต่อผู้ดูแลระบบ", status: 401 });
        }
        const userId = String(user.user_id);
        const role = user.role;
        const token = genarateToken(userId, role);
        res.cookie('token', token, cookieOptions);
        return res.status(200).json({ message: ResponseMessage.USER_LOGIN_SUCCESS, status: 200 });
    } catch (err) {
        return res.status(500).json({ message: ResponseMessage.USER_LOGIN_FAILED, status: 500 });
    }
}

export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
    });

    return res.status(200).json({
        message: ResponseMessage.USER_LOGOUT_SUCCESS,
        status: 200,
    });
};

export const authMiddleware = (req: CookieInfo, res: Response, next: Function) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as jwt.JwtPayload;

        req.user = {
            id: Number(payload.sub),
            role: payload.role as string,
        };
        next();
    } catch {
        return res.status(401).json({ message: ResponseMessage.FAIL_DATA });
    }
};

export const adminOnly = (
    req: CookieInfo,
    res: Response,
    next: Function
) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};