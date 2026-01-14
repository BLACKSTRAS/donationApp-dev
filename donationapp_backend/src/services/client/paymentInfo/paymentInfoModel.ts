import { pool } from "../../../common/constants/db";
import { ResponseMessage } from "../../../common/constants/responMessage";

export const getPaymentInfo = async (streamerId: number) => {
  try {
    const response = await pool.query(
      `
      SELECT su.promtpay_no, su.bank_no, su.bank_username, su.min_donation,stu.text_with_donate
      FROM steamers_user su
      JOIN setting_user stu ON su.steamer_id = stu.steamer_id
      WHERE su.steamer_id = $1
      `,
      [streamerId]
    );

    if (response.rowCount === 0) {
      throw new Error(ResponseMessage.USER_EMPTY);
    }

    return response.rows.map((d) => ({
      promtpayNo: d.promtpay_no,
      bankNo: d.bank_no,
      bankUsername: d.bank_username,
      minDonation: Number(d.min_donation),
      wordDonate:d.text_with_donate,
    }));
  } catch (err) {
    throw err;
  }
};


export const checkAndSubmitStatement = async ({
  steamerId,
  payload,
  transRef,
  date,
  amount,
  amountSelect,
  sender,
  receiver,
  messageDetails
}: {
  steamerId: number;
  payload: string;
  transRef: string;
  date: string;
  amount: number;
  amountSelect: number;
  sender: string;
  receiver: string;
  messageDetails:string;
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");


    const paymentStreamer = await getPaymentInfo(steamerId);
    const bankUsername = paymentStreamer?.[0]?.bankUsername;

    if (!bankUsername) {
      throw new Error("ไม่มีข้อมูลบัญชีรับเงินของผู้สตรีมเมอร์");
    }

    const receiverParts = receiver.split(" ");
    const receiverFirstName = receiverParts[1];
    const receiverLastNameFirstChar = receiverParts[2]; 

 
    const expectedParts = bankUsername.split(" ");
    const expectedFirstName = expectedParts[0];
    const expectedLastNameFirstChar = expectedParts[1][0];


    if (
      receiverFirstName !== expectedFirstName ||
      receiverLastNameFirstChar !== expectedLastNameFirstChar
    ) {
      throw new Error("ชื่อผู้รับเงินไม่ตรงกับบัญชีระบบ");
    }

    // เช็คจำนวนเงินขั้นต่ำ
    if (amount < amountSelect) {
      throw new Error("จำนวนเงินไม่ถูกต้อง");
    }

    // บันทึกข้อมูลโดเนท
    await client.query(
      `
      INSERT INTO donations
        (steamer_id, donate_by, amout, status, donate_at, trans_ref, payload, donate_details)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      `,
      [steamerId, sender, amount, true, date, transRef, payload,messageDetails]
    );

    await client.query("COMMIT");

    return {
      success: true,
      message: "โดเนทสำเร็จ",
    };
  } catch (err: any) {
    await client.query("ROLLBACK");

    if (err.code === "23505") {
      return {
        success: false,
        message: "สลิปนี้ถูกใช้ไปแล้ว",
      };
    }

    return {
      success: false,
      message: err.message || "เกิดข้อผิดพลาด",
    };
  } finally {
    client.release();
  }
};