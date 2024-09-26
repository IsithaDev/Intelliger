import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";

import catchAsync from "../utils/catchAsync";
import User, { IUser } from "../models/user.model";
import AppError from "../utils/appError";
import { getCookieOptions, getEnv, getTokens } from "../utils";
import sendEmail from "../utils/email";

export interface AuthRequest extends Request {
  user?: IUser;
}

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      email: {
        email: req.body.email,
      },
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = newUser.createEmailVerificationToken();

    await newUser.save({ validateBeforeSave: false });

    try {
      const message = `Click this link to verify your email: https://your-app.com/verify-email?token=${token}`;

      await sendEmail({
        to: newUser.email.email,
        subject: "Verify your email address",
        text: message,
      });

      res.status(201).json({
        status: "success",
        message:
          "User registered successfully! Please verify your email address.",
      });
    } catch (error) {
      newUser.email.verificationToken = undefined;
      newUser.email.verificationTokenExpires = undefined;
      await newUser.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500,
          "SENDING_EMAIL_ERROR"
        )
      );
    }
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return next(
        new AppError("Please provide your email address and password.", 400)
      );
    }

    let user;

    user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { "email.email": usernameOrEmail }],
    }).select("+password");

    if (!user) {
      return next(new AppError(`Invalid username or email address.`, 400));
    }

    if (!user.email.isVerified) {
      return next(
        new AppError(
          "Please verify your email address!",
          403,
          "EMAIL_NOT_VERIFIED"
        )
      );
    }

    const correctPassword = await user.correctPassword(password, user.password);

    if (!correctPassword) {
      return next(new AppError("Incorrect password.", 400));
    }

    const { refreshToken, accessToken } = getTokens(user.id);

    const { refreshTokenCookieOptions, accessTokenCookieOptions } =
      getCookieOptions();

    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("logged_in", true, accessTokenCookieOptions);

    res.status(200).json({
      status: "success",
      message: "Logged in successfully!",
    });
  }
);

const refresh = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentRefreshToken = req.cookies.refresh_token;

    if (!currentRefreshToken) {
      return next(
        new AppError("No refresh token found. Please login in again!", 404)
      );
    }

    const refreshTokenSecret = getEnv("JWT_REFRESH_TOKEN_SECRET");

    const decoded = jwt.verify(
      currentRefreshToken,
      refreshTokenSecret
    ) as JwtPayload;

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError("User belong to this refresh token no longer exists!", 404)
      );
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed the password. Please login in again!",
          400
        )
      );
    }

    const { refreshToken, accessToken } = getTokens(currentUser.id);

    const { refreshTokenCookieOptions, accessTokenCookieOptions } =
      getCookieOptions();

    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("logged_in", true, accessTokenCookieOptions);

    res.status(200).json({
      status: "success",
    });
  }
);

const sendEmailVerification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Please provide your email address.", 400));
    }

    const user = await User.findOne({ "email.email": email });

    if (!user) {
      return next(new AppError("User not found with this email address.", 404));
    }

    if (user.email.isVerified) {
      return next(
        new AppError(
          "Email address is already verified.",
          400,
          "EMAIL_ALREADY_VERIFIED"
        )
      );
    }

    const token = user.createEmailVerificationToken();

    await user.save({ validateBeforeSave: false });

    try {
      const message = `Click this link to verify your email: https://your-app.com/verify-email?token=${token}`;

      await sendEmail({
        to: user.email.email,
        subject: "Verify your email address",
        text: message,
      });

      res.status(201).json({
        status: "success",
        message:
          "Verification token send successfully! Please verify your email address.",
      });
    } catch (error) {
      user.email.verificationToken = undefined;
      user.email.verificationTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500,
          "SENDING_EMAIL_ERROR"
        )
      );
    }
  }
);

const verifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token as string)
      .digest("hex");

    const user = await User.findOne({
      "email.verificationToken": hashedToken,
      "email.verificationTokenExpires": { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Invalid or expired verification token.", 400));
    }

    user.email.isVerified = true;
    user.email.verificationToken = undefined;
    user.email.verificationTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Email verified successfully!",
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("refresh_token");
    res.clearCookie("access_token");
    res.clearCookie("logged_in");

    res.status(200).json({
      status: "success",
      message: "Logged out successfully!",
    });
  }
);

const updatePassword = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id).select("+password");

    if (!user) {
      return next(new AppError("Can't find user with id", 404));
    }

    const isCorrectPassword = await user.correctPassword(
      req.body.currentPassword,
      user.password
    );

    if (!isCorrectPassword) {
      return next(new AppError("Password is incorrect!", 400));
    }

    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    res.status(200).json({
      status: "success",
    });
  }
);

export default {
  register,
  login,
  refresh,
  sendEmailVerification,
  verifyEmail,
  logout,
  updatePassword,
};
