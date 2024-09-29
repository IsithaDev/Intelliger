import { Router } from "express";

import userController from "../controllers/user.controller";
import protect from "../middlewares/protect.middleware";

const router = Router();

router.use(protect);

router.get("/me", userController.getMe, userController.getUser);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
