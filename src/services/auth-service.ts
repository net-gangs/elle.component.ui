import { apiClient } from "@/lib/api-client";
import type {
  AuthEmailLoginDto,
  LoginResponseDto,
  RefreshResponseDto,
  User,
} from "@/types/auth";
import type { ApiResponse } from "@/types/api";

export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: AuthEmailLoginDto): Promise<LoginResponseDto> => {
    const response = await apiClient.post<never, ApiResponse<LoginResponseDto>>(
      "/auth/email/login",
      credentials
    );
    return response.data;
  },

  /**
   * Refresh the access token
   */
  refresh: async (): Promise<RefreshResponseDto> => {
    const response = await apiClient.post<never, ApiResponse<RefreshResponseDto>>(
      "/auth/refresh"
    );
    return response.data;
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    await apiClient.post<never, ApiResponse<null>>("/auth/logout");
  },

  /**
   * Get the current authenticated user
   */
  me: async (): Promise<User> => {
    const response = await apiClient.get<never, ApiResponse<User>>("/auth/me");
    return response.data;
  },
};
