import { Router } from "express";
import { getToltalAmout, getDashboard } from "./manageController";
import { authMiddleware } from "../../auth/authController";

const router = Router();

router.post("/getToltalAmout", authMiddleware, getToltalAmout);

router.post("/dashboard", authMiddleware, getDashboard);

export default router;
