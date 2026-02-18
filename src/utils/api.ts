import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../types";

/* ================== Axios Instance ================== */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 180_000, // 3 minutes
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
  (error) => {
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

    if (!response?.data) {
      throw new Error(`No data returned from API: ${method} ${url}`);
    }

    return response.data as T;
  } catch (error: any) {
    if (!error.response) {
      console.error(`Network/CORS error on ${method} ${url}`, error);
    } else {
      console.error(
        `API Error (${method} ${url}):`,
        error.response.data || error.message
      );
    }
    throw error;
  }
};

export default api;
