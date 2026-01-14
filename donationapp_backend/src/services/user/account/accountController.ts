import { Request, Response } from "express";
import { ResponseMessage } from "../../../common/constants/responMessage";
import {
  getAccountBundleByUserId,
  updateContact,
  updatePersonal,
  updateAddress,
  updatePayment,
  updateImageUser
} from "./accountModel";
import { AccountInfo } from "../../../common/interface/authInterface";

const getUserId = (userId: number) => {
  const id = Number(userId);
  return Number.isNaN(id) ? null : id;
};

export const getUserDetailById = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  const userId = getUserId(req.user.id);
  if (userId === null) {
    return res.status(400).json({
      status: 400,
      message: ResponseMessage.FAIL_DATA,
    });
  }
  try {
    const userDetail = await getAccountBundleByUserId(userId);
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      userDetail,
    });
  } catch {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }
};

export const updateContactByUserId = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }
  const userId = getUserId(req.user.id);
  const { email, telephone } = req.body ?? {};
  if (!userId) {
    return res.status(400).json({
      status: 400,
      message: ResponseMessage.FAIL_DATA,
    });
  }
  try {
    const response = await updateContact(userId, email, telephone);
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      response,
    });
  } catch {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }
};

export const updatePersonalByUserId = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }
  const userId = getUserId(req.user.id);
  const { firstName, lastName, title, birthDay, idCard } = req.body ?? {};

  if (!userId) {
    return res.status(400).json({
      status: 400,
      message: ResponseMessage.FAIL_DATA,
    });
  }
  try {
    const response = await updatePersonal(userId, firstName, lastName, title, birthDay, idCard);
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      response,
    });
  } catch {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }
};

export const updateAddressByUserId = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  const userId = getUserId(req.user.id);
  const { address, province, distric, subDistrict, zipcode } = req.body ?? {};
  console.log("address", req.body);
  if (!userId) {
    return res.status(400).json({
      status: 400,
      message: ResponseMessage.FAIL_DATA,
    });
  }
  try {
    const response = await updateAddress(userId, address, province, distric, subDistrict, zipcode);
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      response,
    });
  } catch {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }
};

export const updatePaymentByUserId = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }

  const userId = getUserId(req.user.id);
  const { promtPayType, promtPayNo, bankType, bankNo, bankUsername } = req.body ?? {};
  console.log("address", req.body);
  if (!userId) {
    return res.status(400).json({
      status: 400,
      message: ResponseMessage.FAIL_DATA,
    });
  }
  try {
    const response = await updatePayment(userId, promtPayType, promtPayNo, bankType, bankNo, bankUsername);
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      response,
    });
  } catch {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }
};

export const uploadProfileImage = async (req: AccountInfo, res: Response) => {
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

  const imageUrl = `/uploads/profile/${req.file.filename}`;
  const imageName = req.file.filename;
  const userId = getUserId(req.user.id);
  try {
    const response = await updateImageUser(userId!, imageName);
    return res.status(200).json({
      status: 200,
      message: ResponseMessage.SUCCESS_DATA,
      imageUrl,
    });
  } catch {
    return res.status(500).json({
      status: 500,
      message: ResponseMessage.FAIL_DATA,
    });
  }
};
