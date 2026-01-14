import { pool } from "../../../common/constants/db";
import { ResponseMessage } from "../../../common/constants/responMessage";
import { steamerDetail } from "../../../common/interface/authInterface";

/*  GET ACCOUNT  */
export const getAccountBundleByUserId = async (userId: number) => {
  if (!userId) return;

  // ดึงข้อมูลผู้ใช้
  const user = await pool.query(
    `SELECT user_id as "userId", user_name as "userName", title, first_name as "firstName", last_name as "lastName",
            email, telephone as "phoneNumber", role, create_date as "creatDate", image_user
     FROM users 
     WHERE user_id = $1`,
    [userId]
  );

  // ดึงข้อมูลสตรีมเมอร์
  const steamer = await pool.query(
    `SELECT steamer_id as "steamerId", idcard, birthday, address, distric, subdistrict, province, zipCode, 
            promtpay_type as "promtpayType", promtpay_no as "promtpayNo", 
            bank_type as "bankType", bank_no as "bankNo", bank_username as "bankUsername", 
            min_donation as "minDonation"
     FROM steamers_user 
     WHERE user_id = $1`,
    [userId]
  );

  const steamerId = steamer.rows[0]?.steamerId;

  // ค่า default
  let totalDonate = "0";
  let words: string[] = [];
  let wordDonate: string = "";
  let wordFilterSystem: string[] = [];

  if (steamerId) {
    // รวมยอดบริจาค
    const sum = await pool.query(
      `SELECT COALESCE(SUM(amout),0) AS total FROM donations WHERE steamer_id = $1`,
      [steamerId]
    );
    totalDonate = sum.rows[0]?.total ?? "0";


    const settingDetails = await pool.query(
      `SELECT COALESCE(word_filter, '{}') AS word_filter, COALESCE(text_with_donate, '') AS text_with_donate
       FROM setting_user 
       WHERE steamer_id = $1`,
      [steamerId]
    );

    words = settingDetails.rows[0]?.word_filter ?? [];
    wordDonate = settingDetails.rows[0]?.text_with_donate ?? "";

    // ดึงคำที่ระบบกรอง
    const wordSystem = await pool.query(`SELECT word FROM admin_global_word_filter`);
    wordFilterSystem = wordSystem.rows?.map(row => row.word) ?? [];
  }

  // สร้าง object ส่งออก
  const userDetail: steamerDetail = {
    streamerId: steamer.rows[0]?.steamerId,
    userId: user.rows[0]?.userId,
    userName: user.rows[0]?.userName,
    email: user.rows[0]?.email,
    phoneNumber: user.rows[0]?.phoneNumber,
    title: user.rows[0]?.title,
    firstName: user.rows[0]?.firstName,
    lastName: user.rows[0]?.lastName,
    idCard: steamer.rows[0]?.idcard,
    birthDay: steamer.rows[0]?.birthday,
    address: steamer.rows[0]?.address,
    subDistrict: steamer.rows[0]?.subdistrict,
    distric: steamer.rows[0]?.distric,
    province: steamer.rows[0]?.province,
    zipcode: steamer.rows[0]?.zipCode,
    promtPayType: steamer.rows[0]?.promtpayType,
    promtPayNo: steamer.rows[0]?.promtpayNo,
    bankType: steamer.rows[0]?.bankType,
    bankNo: steamer.rows[0]?.bankNo,
    bankUsername: steamer.rows[0]?.bankUsername,
    minDonation: steamer.rows[0]?.minDonation,
    totalDonate: totalDonate,
    creatDate: user.rows[0]?.creatDate,
    imageUser: user.rows[0]?.image_user,
    words: words,
    wordDonate: wordDonate,
    wordFilterSystem: wordFilterSystem
  };

  return userDetail;
};


export const updateContact = async (userId: number, email?: string, phoneNumber?: string) => {
  if (!userId) return;
  return pool.query(`UPDATE users SET email = COALESCE($2,email), telephone = COALESCE($3,telephone) WHERE user_id = $1`, [userId, email ?? null, phoneNumber ?? null]);
}

export const updatePersonal = async (
  userId: number,
  firstName?: string,
  lastName?: string,
  title?: string,
  birthDay?: Date,
  idCard?: string
) => {
  if (!userId) throw new Error('userId is required');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (
      firstName !== undefined ||
      lastName !== undefined ||
      title !== undefined
    ) {
      await client.query(
        `UPDATE users
         SET first_name = COALESCE($2, first_name),
             last_name  = COALESCE($3, last_name),
             title      = COALESCE($4, title)
         WHERE user_id = $1`,
        [userId, firstName ?? null, lastName ?? null, title ?? null]
      );
    }

    if (birthDay !== undefined || idCard !== undefined) {
      await client.query(
        `UPDATE steamers_user
         SET birthday = COALESCE($2, birthday),
             idcard   = COALESCE($3, idcard)
         WHERE user_id = $1`,
        [userId, birthDay ?? null, idCard ?? null]
      );
    }

    await client.query('COMMIT');
    return true;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateAddress = async (
  userId: number,
  address?: string,
  province?: string,
  distric?: string,
  subDistrict?: string,
  zipcode?: string
) => {
  if (!userId) return;
  return pool.query(`
    UPDATE steamers_user
    SET address = COALESCE($2, address),
        province = COALESCE($3, province),
        distric = COALESCE($4, distric),
        subdistrict = COALESCE($5, subdistrict),
        zipcode = COALESCE($6, zipcode)
    WHERE user_id = $1
  `, [userId, address ?? null, province ?? null, distric ?? null, subDistrict ?? null, zipcode ?? null]);
};


export const updatePayment = async (
  userId: number,
  promtPayType?: number,
  promtPayNo?: string,
  bankType?: number,
  bankNo?: string,
  bankUsername?: string
) => {
  if (!userId) return;
  return pool.query(`
    UPDATE steamers_user
    SET promtpay_type = COALESCE($2, promtpay_type),
        promtpay_no = COALESCE($3, promtpay_no),
        bank_type = COALESCE($4, bank_type),
        bank_no = COALESCE($5, bank_no),
        bank_username = COALESCE($6, bank_username)
    WHERE user_id = $1
  `, [userId, promtPayType ?? null, promtPayNo ?? null, bankType ?? null, bankNo ?? null, bankUsername ?? null]);
};

export const updateImageUser = async (userId: number, imageUser: string) => {
  if (!userId) return;
  return pool.query(`UPDATE users SET image_user = $2 WHERE user_id = $1`, [userId, imageUser]);
}
