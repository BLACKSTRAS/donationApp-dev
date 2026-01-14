import { Router } from "express";
import { authMiddleware } from "../../auth/authController";
import { getUserInfo } from "./userInfoController";

const router = Router();
router.get("/getUserInfo",authMiddleware,getUserInfo)

export default router;