import axiosInstance from "../lib/axios";

export const register = async (userData: {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  dateOfBirth: Date;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);

    return response.data;
  } catch (error) {
    return error;
  }
};
