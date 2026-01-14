import { Request, Response } from "express";
import {
  getAllWordFilter,
  addWordFilter,
  deleteWordFilter,
} from "./donationsModel";

export const getWordFilter = async (_req: Request, res: Response) => {
  try {
    const words = await getAllWordFilter();
    return res.status(200).json({
      message: "success",
      data: words,
    });
  } catch {
    return res.status(500).json({
      message: "ไม่สามารถดึงข้อมูลได้",
    });
  }
};

export const addWordFilterByAdmin = async (req: Request, res: Response) => {
  const { word } = req.body;

  if (!word || !word.trim()) {
    return res.status(400).json({ message: "กรุณากรอกคำต้องห้าม" });
  }

  try {
    const result = await addWordFilter(word);

    if (!result) {
      return res.status(409).json({
        message: "คำนี้มีอยู่ในระบบแล้ว",
      });
    }

    return res.status(201).json({
      message: "เพิ่มคำต้องห้ามสำเร็จ",
      data: result,
    });
  } catch {
    return res.status(500).json({
      message: "เพิ่มคำต้องห้ามไม่สำเร็จ",
    });
  }
};

export const deleteWordFilterByAdmin = async (req: Request, res: Response) => {
  const { word } = req.params;

  if (!word) {
    return res.status(400).json({ message: "กรุณาระบุคำที่ต้องการลบ" });
  }

  try {
    const result = await deleteWordFilter(word);

    if (!result) {
      return res.status(404).json({
        message: "ไม่พบคำต้องห้ามนี้ในระบบ",
      });
    }

    return res.status(200).json({
      message: "ลบคำต้องห้ามสำเร็จ",
    });
  } catch {
    return res.status(500).json({
      message: "ลบคำต้องห้ามไม่สำเร็จ",
    });
  }
};
