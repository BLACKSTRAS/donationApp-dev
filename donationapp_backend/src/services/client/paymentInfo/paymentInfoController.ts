import { AccountInfo } from "../../../common/interface/authInterface";
import { ResponseMessage } from "../../../common/constants/responMessage";
import { Request, Response } from "express";
import dotenv from 'dotenv';
import { pool } from "../../../common/constants/db";
import { checkAndSubmitStatement, getPaymentInfo } from "./paymentInfoModel";
import { emitDonation } from "../../..";
import { generateVoice } from "../../../utils/ttsGenerator";

dotenv.config();

export function decryptId(token?: string): number | null {
    if (!token) return null;

    const secret = Number(process.env.SECRET);
    if (!secret || Number.isNaN(secret)) return null;

    const encrypted = parseInt(token, 36);
    if (Number.isNaN(encrypted)) return null;

    const id = encrypted ^ secret;
    if (!Number.isInteger(id) || id <= 0) return null;

    return id;
}

export const getPaymentInfoStreamer = async (req: AccountInfo, res: Response) => {
    const { token } = req.body;
    const streamerId = decryptId(token);
    if (!streamerId) {
        return res.status(400).json({
            status: 400,
            message: ResponseMessage.USER_EMPTY,
        });
    }
    try {
        const result = await getPaymentInfo(streamerId);
        return res.status(200).json({
            status: 200,
            result: result[0]
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: err,
        });
    }
};

export const checkStatementResult = async (req: AccountInfo, res: Response) => {
    try {
        const {
            sender,
            receiver,
            transRef,
            payload,
            date,
            amount,
            amountSelect,
            token,
            messageDetails
        } = req.body;

        const steamerId = decryptId(token);
        if (!steamerId) {
            return res.status(401).json({
                success: false,
                message: ResponseMessage.USER_EMPTY,
            });
        }
        const result = await checkAndSubmitStatement({
            sender,
            receiver,
            transRef,
            payload,
            date,
            amount,
            amountSelect,
            steamerId,
            messageDetails
        });

        if (!result.success) {
            return res.status(400).json(result);
        }
        if (result.success) {
            processDonationBackground({
                steamerId,
                donate_by: sender,
                amount,
                donate_details: messageDetails
            });
        }
        return res.status(200).json({
            status: 200,
            result: result
        });

    } catch (err: any) {
        console.error("[checkStatementResult]", err);

        return res.status(500).json({
            status: 500,
            success: false,
            message: "เกิดข้อผิดพลาดของระบบ",
        });
    }
};

export async function processDonationBackground(params: {
    steamerId: number;
    donate_by: string;
    amount: number;
    donate_details?: string;
}) {
    const { steamerId, donate_by, amount, donate_details } = params;

    try {
        const querySetting = await pool.query(`
            SELECT su.widget_status, su.display_donate_status, su.type_setting_donate_noti,
                   su.word_filter, vm.config_path
            FROM setting_user su
            JOIN voice_models vm ON su.model_id = vm.model_id
            WHERE su.steamer_id = $1
        `, [steamerId]);

        if (!querySetting.rows.length) {
            console.warn(`สตรีมเมอร์ยังไม่ได้ตั้งค่า วิตเจ็ท`);
            return;
        }

        const dataSetting = querySetting.rows[0];

        if (dataSetting?.widget_status && dataSetting?.display_donate_status) {
            const voiceName = dataSetting?.config_path;

            const filters: string[] = dataSetting.word_filter ?? [];

            let safeMessage = donate_details ?? "";
            for (const word of filters) {
                if (!word) continue;
                const regex = new RegExp(word, "gi");
                safeMessage = safeMessage.replace(regex, "***");
            }

            let safeName = donate_by ?? "";
            for (const word of filters) {
                if (!word) continue;
                const regex = new RegExp(word, "gi");
                safeName = safeName.replace(regex, "***");
            }
            const widgetType = dataSetting?.type_setting_donate_noti;
            const audioData = await generateVoice(safeMessage, voiceName);

            emitDonation({
                steamerId,
                donate_by: safeName,
                amount,
                donate_details: safeMessage,
                widgetType:widgetType,
                soundUrl: audioData || ""
            });
        }
    } catch (err) {
        console.error("Error generating voice or emitting donation:", err);
    }
}
