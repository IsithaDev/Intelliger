import express, { NextFunction, Request, Response } from "express";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import AppError from "./utils/appError";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

export default app;
