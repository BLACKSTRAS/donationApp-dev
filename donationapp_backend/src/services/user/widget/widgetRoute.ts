import { Router } from "express";/* 
import { WidgetController } from "./widgetController"; */
import { authMiddleware } from "../../auth/authController";
import { getUserDetails, previewWidget, saveSettingDetailsByUserId } from "./widgetController";

const router = Router();


router.get("/getUserDetails",authMiddleware,getUserDetails)
router.post("/saveSetting",authMiddleware,saveSettingDetailsByUserId)
router.post("/previewWidget",authMiddleware,previewWidget)

export default router;
