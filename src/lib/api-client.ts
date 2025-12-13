import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { authActions } from "@/stores/auth-store";
import type { RefreshResponseDto } from "@/types/auth";
import type { ApiResponse } from "@/types/api";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const token = authActions.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/email/login") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Wait for refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = authActions.getRefreshToken();

      if (!refreshToken) {
        authActions.logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {

        const response = await axios.post<ApiResponse<RefreshResponseDto>>(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );


        const { token, refreshToken: newRefreshToken, tokenExpires } = response.data.data;

        authActions.refresh({ token, refreshToken: newRefreshToken, tokenExpires });

        processQueue(null, token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        authActions.logout();
        toast.error("Session expired", {
          description: "Please login again",
        });
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const message =
      (error.response?.data as { message?: string })?.message || error.message;
    console.log(error)
    if (error.response?.status === 403) {
      toast.error("Access denied", {
        description: "You don't have permission to access this resource",
      });
    } else if (error.response?.status === 404) {
      toast.error("Not found", {
        description: message,
      });
    } else if (error.response?.status === 500) {
      toast.error("Server error", {
        description: "Something went wrong. Please try again later.",
      });
    } else if (error.response?.status !== 401) {
      toast.error("Error", {
        description: message,
      });
    }

    return Promise.reject(error);
  }
);