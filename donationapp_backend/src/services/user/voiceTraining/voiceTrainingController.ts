import { ResponseMessage } from "../../../common/constants/responMessage";
import { AccountInfo } from "../../../common/interface/authInterface";
import {
  deleteVoiceRef,
  getListVoiceUserById,
  getVoiceModelIsUse,
  updateVoiceRef,
  useVoiceRef,
} from "./voiceTrainingModel";
import { Response } from "express";
import { randomUUID } from "crypto";
import { uploadToSupabase } from "../../../utils/uploadToSupabase";
// ✅ ใช้ Supabase

const getUserId = (userId: number) => {
  const id = Number(userId);
  return Number.isNaN(id) ? null : id;
};

/* =====================================================
   Upload Voice Reference (ไฟล์เสียง)
   ===================================================== */
export const uploadVoiceRef = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  if (!req.file) {
    return res.status(400).json({
      status: 400,
      message: "No file uploaded",
    });
  }

  const userId = getUserId(req.user.id);
  const file = req.file;

  try {
    /* =========================
       ❌ LOCAL FILE (ของเดิม)
       ========================= */
    // const audioUrl = `/uploads/audios/voiceRef/${file.filename}`;
    // const audioName = file.filename;
    // await updateVoiceRef(userId!, audioName, file.originalname);

    /* =========================
       ✅ SUPABASE STORAGE (ใหม่)
       ========================= */
    const ext = file.originalname.split(".").pop();
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = `voices/${fileName}`;

    const audioUrl = await uploadToSupabase(
      "media",
      filePath,
      file.buffer,
      file.mimetype
    );

    await updateVoiceRef(userId!, fileName, file.originalname);

    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      audioUrl,
    });
  } catch (err) {
    console.error("uploadVoiceRef error:", err);
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }
};

/* =====================================================
   ฟังก์ชันด้านล่าง ❌ ไม่เกี่ยวกับไฟล์
   ===================================================== */

export const getListVoiceUser = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  const userId = getUserId(req.user.id);
  if (!userId) {
    return res.status(400).json({
      status: 400,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  try {
    const response = await getListVoiceUserById(userId);
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      result: response,
    });
  } catch {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }
};

export const setVoiceModelForUser = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  const userId = getUserId(req.user.id);
  const { modelId } = req.body;

  if (!userId || !modelId) {
    return res.status(400).json({
      status: 400,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  try {
    const response = await useVoiceRef(userId, modelId);
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      result: response,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
      error: err,
    });
  }
};

export const deleteVoiceById = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  const userId = getUserId(req.user.id);
  const { modelId } = req.body;

  if (!userId || !modelId) {
    return res.status(400).json({
      status: 400,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  try {
    const response = await deleteVoiceRef(userId, modelId);
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      result: response,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
      error: err,
    });
  }
};

export const getVoiceIsUseByUserId = async (
  req: AccountInfo,
  res: Response
) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  const userId = getUserId(req.user.id);
  if (!userId) {
    return res.status(400).json({
      status: 400,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  try {
    const response = await getVoiceModelIsUse(userId);
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      result: response?.fileName,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
      error: err,
    });
  }
};
