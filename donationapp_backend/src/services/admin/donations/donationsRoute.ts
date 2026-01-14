import { Router } from "express";

import {
  getWordFilter,
  addWordFilterByAdmin,
  deleteWordFilterByAdmin,
} from "./donationsController";
import { adminOnly, authMiddleware } from "../../auth/authController";

const router = Router();

router.get("/word-filter", getWordFilter, authMiddleware, adminOnly);
router.post("/word-filter", addWordFilterByAdmin, authMiddleware, adminOnly);
router.delete(
  "/word-filter/:word",
  deleteWordFilterByAdmin,
  authMiddleware,
  adminOnly
);

export default router;
