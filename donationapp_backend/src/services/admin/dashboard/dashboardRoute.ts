import { Router } from "express";
import { dashboardStats } from "./dashboardController";

const router = Router();

router.get("/dashboard/stats", dashboardStats);

export default router;
