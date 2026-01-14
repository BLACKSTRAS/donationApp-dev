import { Router } from "express";
import { UsersController } from "./usersController";
import { adminOnly, authMiddleware } from "../../auth/authController";


const router = Router();

router.get("/", authMiddleware, adminOnly, UsersController.getUsers);
router.get("/:id", authMiddleware, adminOnly, UsersController.getUserDetail);
router.patch("/:id/role", authMiddleware, adminOnly, UsersController.changeRole);
router.patch("/:id/status", authMiddleware, adminOnly, UsersController.changeStatus);

export default router;
