import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8080/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      const accessToken = Cookies.get("access_token");

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refresh_token");
        const response = await axios.post(
          "http://127.0.0.1:8080/api/v1/auth/refresh",
          { token: refreshToken },
          { withCredentials: true },
        );

        const newAccessToken = response.data.accessToken;

        axiosInstance.defaults.headers["Authorization"] =
          `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("logged_in");

        window.location.href = "/sign-in";

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
