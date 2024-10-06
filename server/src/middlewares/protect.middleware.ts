import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { AuthRequest } from "../controllers/auth.controller";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { getEnv } from "../utils";
import User from "../models/user.model";

const protect = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let access_token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    const accessTokenSecret = getEnv("JWT_ACCESS_TOKEN_SECRET");

    const decodedRaw = jwt.verify(access_token, accessTokenSecret);

    const decoded = decodedRaw as JwtPayload;

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError("User belong to this token no longer exists!", 401)
      );
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError("User recently changed password! Please log in again", 401)
      );
    }

    req.user = currentUser;

    next();
  }
);

export default protect;
