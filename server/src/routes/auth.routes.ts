import { Router } from "express";

import authController from "../controllers/auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/send-email-verification", authController.sendEmailVerification);
router.get("/verify-email", authController.verifyEmail);
router.get("/logout", authController.logout);

export default router;
