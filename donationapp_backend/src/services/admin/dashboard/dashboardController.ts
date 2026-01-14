import { Request, Response } from "express";
import { getDashboardStats } from "./dashbordModel";

export async function dashboardStats(req: Request, res: Response) {
  try {
    const data = await getDashboardStats();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
}
