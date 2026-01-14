// src/services/user/Histories/DonateHistoryController.ts
import { Request, Response } from "express";
import { getDonateHistories } from "./donateHistoryModel";
import { ResponseMessage } from "../../../common/constants/responMessage";
import { AccountInfo } from "../../../common/interface/authInterface";

export const getDonateHistory = async (req: AccountInfo, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({
      status: 401,
      message: ResponseMessage.FAIL_DATA,
    });
  }
  const userId = req.user.id;
  try {
    const page = Number(req.body.page || 1);
    const limit = Number(req.body.limit || 10);

    const result = await getDonateHistories(userId, page, limit);

    res.json({
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
      items: result.items,
    });
  } catch (error) {
    res.status(500).json({ message: ResponseMessage.FAIL_DATA });
  }
};
