import { NextFunction, Request, Response } from "express";

import User from "../models/user.model";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { AuthRequest } from "./auth.controller";

const getMe = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("Can't find user. Please login again.", 404));
  }

  req.params.id = req.user.id;

  next();
};

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        data: users,
      },
    });
  }
);

const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new AppError(`Can't find user with id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  }
);

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: newUser,
      },
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(
        new AppError(`Can't find user with id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  }
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(
        new AppError(`Can't find user with id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  }
);

export default {
  getMe,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
