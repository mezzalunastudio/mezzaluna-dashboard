import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { UNAUTHORIZED } from "../constants/http";
import { navigate } from "./navigation";

const options: AxiosRequestConfig = {
  baseURL: "http://localhost:4004",
  withCredentials: true,
};

// Membuat klien terpisah untuk penyegaran token
const TokenRefreshClient = axios.create(options);

TokenRefreshClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Token refresh response:", response);
    return response.data;
  },
  (error: AxiosError) => {
    console.error("Token refresh error:", error);
    return Promise.reject(error);
  }
);

const API = axios.create(options);

// interseptor logging
API.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log("Response intercepted:", response);
    return response.data;
  },
  async (error: AxiosError) => {
    console.error("Error intercepted:", error); // Tambahkan log ini
    const { config, response } = error;
    const status = response?.status;
    const data = response?.data as { errorCode?: string; [key: string]: any };
    console.log("Original config:", config);
    console.log("Response data:", response?.data);
    // Log tambahan sesuai dengan alur Anda
    if (status === UNAUTHORIZED && data?.errorCode === "InvalidAccessToken") {
      console.log("Attempting token refresh...");
      try {
        await TokenRefreshClient.get("/auth/refresh");
        if (config) {
          console.log("Retrying original request...");
          return TokenRefreshClient(config); // Retry request
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        navigate("/auth/login");
      }
    }
    return Promise.reject({ status, ...data });
  }
);
export default API;
