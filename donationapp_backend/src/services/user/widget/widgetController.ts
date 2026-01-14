import { Request, Response } from "express";
import { pool } from "../../../common/constants/db";
import { AccountInfo } from "../../../common/interface/authInterface";
import { ResponseMessage } from "../../../common/constants/responMessage";
import { saveSettingDetails } from "./widgetModel";
import { emitDonation } from "../../..";




async function getSteamerIdFromUserId(userId: number): Promise<number | null> {
  const { rows } = await pool.query(
    `SELECT steamer_id FROM steamers_user WHERE user_id = $1`,
    [userId]
  );
  if (!rows.length) return null;
  return rows[0].steamer_id;
}


export const getUserDetails = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }
  const userId = req.user.id;
  if (userId === null) {
    return res.status(400).json({
      status: 400,
      message: ResponseMessage.USER_EMPTY,
    });
  }
  try {
    const steamerDetail = await pool.query(`
    SELECT steamer_id ,widget_token FROM steamers_user WHERE user_id = $1
    `, [userId]);
    const steamerId = steamerDetail?.rows[0]?.steamer_id;
    const widgetToken = steamerDetail?.rows[0]?.widget_token;
    const settingDetails = await pool.query(`
       SELECT type_setting_donate_noti,
       display_donate_status, widget_status
       FROM setting_user
       WHERE steamer_id = $1
      `, [steamerId]);
    const typeSettingDonate = settingDetails?.rows[0]?.type_setting_donate_noti;
    const displayDonateStatus = settingDetails?.rows[0]?.display_donate_status;
    const widgetStatus = settingDetails?.rows[0]?.widget_status;
    const result = {
      widgetToken: widgetToken,
      typeSettingDonate: typeSettingDonate,
      displayDonateStatus: displayDonateStatus,
      widgetStatus: widgetStatus
    }
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      result: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }
}


export const saveSettingDetailsByUserId = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }
  const userId = req.user.id;
  const { displayDonateStatus, typeSettingDonate, widgetStatus } = req.body
  if (userId === null) {
    return res.status(400).json({
      status: 400,
      message: ResponseMessage.USER_EMPTY,
    });
  }
  try {
    const response = await saveSettingDetails(userId, { displayDonateStatus, typeSettingDonate, widgetStatus });
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      result: response,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }

}

export const previewWidget = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT steamer_id FROM steamers_user WHERE user_id = $1`,
      [userId]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        status: 404,
        message: "Steamer not found",
      });
    }

    const steamerId = result.rows[0].steamer_id;

    const { donate_by, amount, donate_details } = req.body;

    const querySetting = await pool.query(`
            SELECT su.widget_status, su.display_donate_status, su.type_setting_donate_noti,
                   su.word_filter, vm.config_path
            FROM setting_user su
            left JOIN voice_models vm ON su.model_id = vm.model_id
            WHERE su.steamer_id = $1
        `, [steamerId]);

    if (!querySetting.rows.length) {
      return res.status(500).json({
        status: 500,
        message: "สตรีมเมอร์ยังไม่ได้ตั้งค่า วิตเจ็ท",
      });
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

      emitDonation({
        steamerId,
        donate_by: safeName,
        amount,
        donate_details: safeMessage,
        soundUrl: "",
        preview: true,
        widgetType: widgetType,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Preview sent",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }
};
