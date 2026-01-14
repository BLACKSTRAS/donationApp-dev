import { Router } from "express";
import { authMiddleware } from "../../auth/authController";
import { uploadAudio } from "../../../upload.middleware";
import { deleteVoiceById, getListVoiceUser, getVoiceIsUseByUserId, setVoiceModelForUser, uploadVoiceRef } from "./voiceTrainingController";

const router = Router();

router.get("/getListVoice",authMiddleware,getListVoiceUser)
router.post("/useVoiceModel",authMiddleware,setVoiceModelForUser)
router.post("/deleteVoiceModel",authMiddleware,deleteVoiceById)
router.get("/getVoiceIsUse",authMiddleware,getVoiceIsUseByUserId)
router.post(
  "/upload/voice",
  authMiddleware,
  uploadAudio.single("voice"),
  uploadVoiceRef
);
export default router;