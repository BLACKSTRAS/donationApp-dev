import { ResponseMessage } from "../../../common/constants/responMessage";
import { AccountInfo } from "../../../common/interface/authInterface";
import { Request, response, Response } from "express";
import { addWordFilter, addWordWithDonate, deleteWordFilter, submitMinAmout } from "./paymentModel";


const getUserId = (userId: number) => {
    const id = Number(userId);
    return Number.isNaN(id) ? null : id;
};


export const submitMinAmoutByUserId = async (req: AccountInfo, res: Response) => {
    if (!req.user?.id) {
        return res.status(401).json({
            status: 401,
            message: ResponseMessage.FAIL_DATA,
        });
    }
    const userId = getUserId(req.user.id);
    const { minAmout } = req.body;
    console.log(minAmout, userId)
    try {
        if (!userId) {
            return res.status(400).json({ message: ResponseMessage.USER_EMPTY });
        }
        const response = await submitMinAmout(userId, minAmout);
        if (response.rowCount === 0) { // เช็คว่ามี row ถูกอัปเดตไหม
            return res.status(404).json({ message: "ไม่พบผู้ใช้" });
        }
        return res.status(200).json({
            message: ResponseMessage.SUCCESS_DATA,
            result: response?.rows[0]
        });
    } catch (err) {
        return res.status(500).json({ message: ResponseMessage.FAIL_DATA });
    }
};

export const addWordFilterByUserId = async (req: AccountInfo, res: Response) => {
    if (!req.user?.id) {
        return res.status(401).json({
            status: 401,
            message: ResponseMessage.FAIL_DATA,
        });
    }
    const userId = getUserId(req.user.id);
    const { wordFilter } = req.body;
    if (!wordFilter || wordFilter.trim() === "") {
        return res.status(400).json({ message: "กรุณากรอกคำที่ต้องการกรอง อย่างน้อย 1 ตัวอักษร" });
    }
    try {
        if (!userId) {
            return res.status(400).json({ message: ResponseMessage.USER_EMPTY });
        }
        const response = await addWordFilter(userId, wordFilter);
        return res.status(200).json({
            message: ResponseMessage.SUCCESS_DATA,
            result: response
        });
    } catch (err) {
        return res.status(500).json({ message: ResponseMessage.FAIL_DATA });
    }
};

export const addWordForDonatePage = async (req: AccountInfo, res: Response) => {
    if (!req.user?.id) {
        return res.status(401).json({
            status: 401,
            message: ResponseMessage.FAIL_DATA,
        });
    }
    const userId = getUserId(req.user.id);
    const { wordDonate } = req.body;
    if (!wordDonate || wordDonate.trim() === "") {
        return res.status(400).json({ message: "กรุณากรอกคำที่ต้องการกรอง อย่างน้อย 1 ตัวอักษร" });
    }
    try {
        if (!userId) {
            return res.status(400).json({ message: ResponseMessage.USER_EMPTY });
        }
        const response = await addWordWithDonate(userId, wordDonate);
        return res.status(200).json({
            message: ResponseMessage.SUCCESS_DATA,
            result: response
        });
    } catch (err) {
        return res.status(500).json({ message: ResponseMessage.FAIL_DATA });
    }
};

export const deleteWordFilterByUserId = async (req: AccountInfo, res: Response) => {
    if (!req.user?.id) {
        return res.status(401).json({
            status: 401,
            message: ResponseMessage.FAIL_DATA,
        });
    }
    const userId = getUserId(req.user?.id);
    const { wordFilter } = req.body;

    if (!wordFilter || wordFilter.trim() === "") {
        return res.status(400).json({ message: "กรุณากรอกคำที่ต้องการกรอง อย่างน้อย 1 ตัวอักษร" });
    }

    try {
        if (!userId) {
            return res.status(400).json({ message: ResponseMessage.USER_EMPTY });
        }
        const updatedRow = await deleteWordFilter(userId, wordFilter);
        return res.status(200).json({
            message: "ลบคำกรองสำเร็จ",
            result: updatedRow
        });
    } catch (err: any) {
        return res.status(500).json({ message: err?.message || "เกิดข้อผิดพลาด" });
    }
};