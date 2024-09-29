import axiosInstance from "../lib/axios";

export const login = async (credentials: {
  usernameOrEmail: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);

    return response.data;
  } catch (error: any) {
    console.error(error);
    // if (error.response) {
    //   console.error("Login failed:", error.response.data);
    //   throw new Error(
    //     error.response.data.message || "Login failed. Please try again.",
    //   );
    // } else if (error.request) {
    //   console.error("No response received:", error.request);
    //   throw new Error(
    //     "Unable to communicate with the server. Please try again later.",
    //   );
    // } else {
    //   console.error("Error:", error.message);
    //   throw new Error("An unexpected error occurred. Please try again.");
    // }
  }
};
