import { Router } from "express";

import authController from "../controllers/auth.controller";
import upload from "../utils/multer";

const router = Router();

router.post("/register", upload.single("profile"), authController.register);

export default router;
