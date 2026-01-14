import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ResponseMessage } from "../../common/constants/responMessage";
import { pool } from "../../common/constants/db";
import bcrypt from "bcrypt";
import { creatNewUser } from "./authModel";
import { Request, Response } from "express";
import {
  AuthInterface,
  CookieInfo,
} from "../../common/interface/authInterface";

dotenv.config();

/* =====================================================
   ✅ COOKIE OPTIONS (PRODUCTION / CROSS-DOMAIN)
   ===================================================== */
const cookieOptions = {
  httpOnly: true,
  secure: true, // ✅ HTTPS เท่านั้น
  sameSite: "none" as const, // ✅ cross-domain
  maxAge: 1000 * 60 * 60 * 24,
  path: "/",
};

/* =====================================================
   JWT
   ===================================================== */
const genarateToken = (id: string, role: string) => {
  return jwt.sign({ role }, process.env.JWT_SECRET as string, {
    subject: id,
    expiresIn: "1d",
  });
};

/* =====================================================
   REGISTER
   ===================================================== */
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body as AuthInterface;

  if (!username || !email || !password) {
    return res.status(400).json({ message: ResponseMessage.INVALID_INPUT });
  }

  const checkDuplicateUser = await pool.query(
    "SELECT user_name, email FROM users WHERE user_name=$1 OR email=$2",
    [username, email]
  );

  if (checkDuplicateUser.rowCount! > 0) {
    if (checkDuplicateUser.rows[0].user_name === username) {
      return res
        .status(409)
        .json({
          message: ResponseMessage.USER_USERNAME_DUPLICATE,
          status: 409,
        });
    }
    if (checkDuplicateUser.rows[0].email === email) {
      return res
        .status(409)
        .json({ message: ResponseMessage.USER_EMAIL_DUPLICATE, status: 409 });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const creatUser = await creatNewUser(username, email, hashedPassword);
    if (!creatUser) {
      return res
        .status(400)
        .json({ message: ResponseMessage.USER_REGISTER_FAILED, status: 400 });
    }

    const token = genarateToken(
      String(creatUser.user.user_id),
      creatUser.user.role
    );

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: ResponseMessage.USER_REGISTER_SUCCESS,
      status: 201,
    });
  } catch {
    return res
      .status(500)
      .json({ message: ResponseMessage.USER_REGISTER_FAILED, status: 500 });
  }
};

/* =====================================================
   LOGIN
   ===================================================== */
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body as AuthInterface;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: ResponseMessage.INVALID_INPUT, status: 400 });
  }

  try {
    const userResult = await pool.query(
      "SELECT user_id, role, status, password FROM users WHERE user_name = $1 OR email = $1",
      [username]
    );

    if (userResult.rowCount === 0) {
      return res
        .status(401)
        .json({ message: ResponseMessage.USER_EMPTY, status: 401 });
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: ResponseMessage.USER_PASSWORD_INVALID, status: 401 });
    }

    if (user.status !== 1) {
      return res
        .status(401)
        .json({ message: "สถานะบัญชีถูกระงับ", status: 401 });
    }

    const token = genarateToken(String(user.user_id), user.role);
    res.cookie("token", token, cookieOptions);

    return res
      .status(200)
      .json({ message: ResponseMessage.USER_LOGIN_SUCCESS, status: 200 });
  } catch {
    return res
      .status(500)
      .json({ message: ResponseMessage.USER_LOGIN_FAILED, status: 500 });
  }
};

/* =====================================================
   LOGOUT
   ===================================================== */
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions);

  return res.status(200).json({
    message: ResponseMessage.USER_LOGOUT_SUCCESS,
    status: 200,
  });
};

/* =====================================================
   AUTH MIDDLEWARE
   ===================================================== */
export const authMiddleware = (
  req: CookieInfo,
  res: Response,
  next: Function
) => {
  const token = req.cookies?.token;

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

/* =====================================================
   ADMIN ONLY
   ===================================================== */
export const adminOnly = (req: CookieInfo, res: Response, next: Function) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
