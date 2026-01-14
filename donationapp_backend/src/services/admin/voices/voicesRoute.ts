import { Router } from "express";
import { listVoices, changeVoiceStatus, playVoice } from "./voicesController";
import { adminOnly, authMiddleware } from "../../auth/authController";

const router = Router();

router.get("/", authMiddleware, adminOnly, listVoices);
router.get("/:id/play", playVoice);
router.patch("/:id/status", authMiddleware, adminOnly, changeVoiceStatus);

export default router;
