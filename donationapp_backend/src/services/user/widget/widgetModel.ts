import { pool } from "../../../common/constants/db";
import crypto from "crypto";

export const saveSettingDetails = async (
  userId: number,
  payload: {
    widgetStatus?: boolean;
    displayDonateStatus?: boolean;
    typeSettingDonate?: number;
  }
) => {
  if (!userId) throw new Error("user not found");

  const steamerRes = await pool.query(
    `SELECT steamer_id FROM steamers_user WHERE user_id = $1`,
    [userId]
  );

  if (steamerRes.rowCount === 0) {
    throw new Error("Steamer not found");
  }

  const steamerId = steamerRes.rows[0].steamer_id;

  const current = await pool.query(
    `SELECT widget_status, display_donate_status, type_setting_donate_noti
     FROM setting_user WHERE steamer_id = $1`,
    [steamerId]
  );

  const data = current.rows[0] ?? {};

  const finalWidgetStatus =
    payload.widgetStatus ?? data.widget_status ?? false;
  const finalDonateStatus =
    payload.displayDonateStatus ?? data.display_donate_status ?? false;
  const finalType =
    payload.typeSettingDonate ?? data.type_setting_donate_noti ?? 0;

  return pool.query(
    `
    INSERT INTO setting_user (steamer_id, widget_status, display_donate_status, type_setting_donate_noti)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (steamer_id)
    DO UPDATE SET
      widget_status = $2,
      display_donate_status = $3,
      type_setting_donate_noti = $4
    `,
    [steamerId, finalWidgetStatus, finalDonateStatus, finalType]
  );
};
