// src/services/user/histories/DonateHistoryRoute.ts
import { Router } from "express";
import { getDonateHistory } from "./donateHistoryController";
import { authMiddleware } from "../../auth/authController";

const router = Router();

router.post("/donateHistory",authMiddleware,getDonateHistory);

export default router;
