import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { ApiResponse } from "../types";

/* ================== Axios Instance ================== */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 300_000, // 5 minutes (safe for payments)
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================== Request Interceptor ================== */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");
      const authToken = adminToken || token;

      if (authToken && config.headers) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================== Response Interceptor ================== */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

/* ================== Generic Typed API Request ================== */
export const apiRequest = async <T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api({
      method,
      url,
      ...(method === "GET" ? { params: data } : { data }),
      ...config,
    });

    if (!response || response.data === undefined) {
      throw new Error(`No data returned from API: ${method} ${url}`);
    }

    return response.data as T;
  } catch (error: any) {
    const axiosError = error as AxiosError;

    if (!axiosError.response) {
      console.error(`Network/CORS error on ${method} ${url}`, error);
    } else {
      const responseData = axiosError.response.data as
        | { message?: string; error?: string }
        | undefined;

      console.error(
        `API Error (${method} ${url}):`,
        responseData?.message ||
          responseData?.error ||
          axiosError.message ||
          error
      );
    }

    const safeMessage =
      (axiosError.response?.data as { message?: string; error?: string })
        ?.message ||
      (axiosError.response?.data as { message?: string; error?: string })
        ?.error ||
      axiosError.message ||
      "API request failed";

    throw new Error(safeMessage);
  }
};

export default api;
