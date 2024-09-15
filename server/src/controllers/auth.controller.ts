import { NextFunction, Request, Response } from "express";
import { UploadApiResponse } from "cloudinary";

import catchAsync from "../utils/catchAsync";
import User from "../models/user.model";
import Cloudinary from "../utils/cloudinary";
import AppError from "../utils/appError";
import { convertBase64, getCookieOptions, getTokens } from "../utils";

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    if (req.file) {
      const dataURI = convertBase64(req.file.buffer, req.file.mimetype);

      const uploadResult: UploadApiResponse = await Cloudinary.uploader.upload(
        dataURI,
        {
          upload_preset: "intelliger",
          folder: "Intelliger/users",
          transformation: {
            width: 200,
            height: 200,
            crop: "fill",
          },
        }
      );

      if (!uploadResult) {
        await newUser.deleteOne();
        return next(new AppError("There was an error uploading image.", 500));
      }

      newUser.images.profile.publicId = uploadResult.public_id;
      newUser.images.profile.url = uploadResult.secure_url;
      await newUser.save({ validateBeforeSave: false });
    }

    res.status(201).json({
      status: "success",
      message: "User registered successfully!",
    });
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

    if (usernameOrEmail.startsWith("@")) {
      user = await User.findOne({ username: usernameOrEmail }).select(
        "+password"
      );
    } else {
      user = await User.findOne({ email: usernameOrEmail }).select("+password");
    }

    if (!user) {
      return next(new AppError(`Invalid username or email address.`, 400));
    }

    const correctPassword = await user.correctPassword(password, user.password);

    if (!correctPassword) {
      return next(new AppError("Incorrect password.", 400));
    }

    const { refreshToken, accessToken } = getTokens(user.id);

    const { refresh_token_cookieOptions, access_token_cookieOptions } =
      getCookieOptions();

    res.cookie("refresh_token", refreshToken, refresh_token_cookieOptions);
    res.cookie("access_token", accessToken, access_token_cookieOptions);
    res.cookie("logged_in", true, access_token_cookieOptions);

    res.status(200).json({
      status: "success",
      message: "Logged in successfully!",
    });
  }
);

export default {
  register,
  login,
};
