import { Router } from "express";

import authController from "../controllers/auth.controller";
import protect from "../middlewares/protect.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refresh", authController.refresh);
router.post("/send-email-verification", authController.sendEmailVerification);
router.get("/verify-email", authController.verifyEmail);
router.get("/logout", authController.logout);

router.use(protect);

router.patch("/update-password", authController.updatePassword);

export default router;
