import axiosInstance from "../lib/axios";
import errorHandler from "./errorHandler";

export const login = async (credentials: {
  usernameOrEmail: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);

    return response.data;
  } catch (error: any) {
    errorHandler(error);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", email);

    return response.data;
  } catch (error: any) {
    errorHandler(error);
  }
};

export const resetPassword = async (token: string) => {
  try {
    const response = await axiosInstance.get(
      `/auth/reset-password?token=${token}`,
    );

    return response.data;
  } catch (error: any) {
    errorHandler(error);
  }
};
