import { Router } from "express";
import {
  getUserDetailById,
  updateContactByUserId,
  updatePersonalByUserId,
  updateAddressByUserId,
  updatePaymentByUserId,
  uploadProfileImage,
} from "./accountController";
import { authMiddleware } from "../../auth/authController";
import { uploadAvatar } from "../../../upload.middleware";

const router = Router();

router.get("/getUserDetailById",authMiddleware, getUserDetailById);


router.patch("/contact",authMiddleware,updateContactByUserId);
router.patch("/personal",authMiddleware, updatePersonalByUserId);
router.patch("/address",authMiddleware, updateAddressByUserId);
router.patch("/payment",authMiddleware, updatePaymentByUserId);
router.post(
  "/upload/avatar",
  authMiddleware,
  uploadAvatar.single("avatar"),
  uploadProfileImage
);

export default router;
