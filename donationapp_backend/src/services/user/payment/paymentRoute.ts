import { Router } from "express";
import { authMiddleware } from "../../auth/authController";
import { addWordFilterByUserId, addWordForDonatePage, deleteWordFilterByUserId, submitMinAmoutByUserId } from "./paymentController";

const router = Router();

router.patch("/submitMinAmout",authMiddleware,submitMinAmoutByUserId)
router.post("/addWordFilter",authMiddleware,addWordFilterByUserId)
router.post("/addWordForDonat",authMiddleware,addWordForDonatePage)
router.post("/deletWordFilter",authMiddleware,deleteWordFilterByUserId)

export default router;
