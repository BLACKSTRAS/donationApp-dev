import { Router } from "express";
import { checkStatementResult, getPaymentInfoStreamer } from "./paymentInfoController";

const router = Router();

router.post('/getPaymentInfo',getPaymentInfoStreamer)
router.post('/checkStatement',checkStatementResult);
export default router;