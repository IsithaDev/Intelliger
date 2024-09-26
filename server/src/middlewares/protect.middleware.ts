import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { AuthRequest } from "../controllers/auth.controller";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { getEnv } from "../utils";
import User from "../models/user.model";

const protect = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let accessToken;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      accessToken = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      accessToken = req.cookies.access_token;
    }

    if (!accessToken) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    const accessTokenSecret = getEnv("JWT_ACCESS_TOKEN_SECRET");

    const decoded = jwt.verify(accessToken, accessTokenSecret) as JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new AppError("User belong to this token no longer exists!", 401)
      );
    }

    req.user = user;

    next();
  }
);

export default protect;
