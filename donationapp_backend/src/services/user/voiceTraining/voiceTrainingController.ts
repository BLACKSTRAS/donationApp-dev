import { ResponseMessage } from "../../../common/constants/responMessage";
import { AccountInfo } from "../../../common/interface/authInterface";
import { deleteVoiceRef, getListVoiceUserById, getVoiceModelIsUse, updateVoiceRef, useVoiceRef } from "./voiceTrainingModel";
import { Request, response, Response } from "express";


const getUserId = (userId: number) => {
  const id = Number(userId);
  return Number.isNaN(id) ? null : id;
};

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
  const file = req.file;
  const audioUrl = `/uploads/audios/voiceRef/${file.filename}`;
  const audioName = file.filename;
  const originName = file.originalname;
  const userId = getUserId(req.user.id);
  try {
    const response = await updateVoiceRef(userId!, audioName, originName);
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      audioUrl,
    });
  } catch {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }
};

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
    const reponse = await getListVoiceUserById(userId);
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      result: reponse
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }
}


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
      result: response
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
      error: err
    });
  }
}


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
      result: response
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
      error: err
    });
  }
}


export const getVoiceIsUseByUserId = async (req: AccountInfo, res: Response) => {
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
    const voiceName = response?.fileName;
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      result: voiceName
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
      error: err
    });
  }
}