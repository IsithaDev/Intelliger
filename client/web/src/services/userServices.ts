import axiosInstance from "@/lib/axios";
import errorHandler from "./errorHandler";

export const getMe = async () => {
  try {
    const response = await axiosInstance.get("/users/me");

    return response.data;
  } catch (error: any) {
    errorHandler(error);
  }
};
