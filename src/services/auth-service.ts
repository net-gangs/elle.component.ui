import { apiClient } from "@/lib/api-client";
import type {
  AuthEmailLoginDto,
  AuthRegisterDto,
  AuthForgotPasswordDto,
  AuthResetPasswordDto,
  AuthGoogleLoginDto,
  AuthFacebookLoginDto,
  AuthAppleLoginDto,
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
   * Register a new user
   */
  register: async (data: AuthRegisterDto): Promise<void> => {
    await apiClient.post<never, ApiResponse<void>>(
      "/auth/email/register",
      data
    );
  },

  /**
   * Request password reset
   */
  forgotPassword: async (data: AuthForgotPasswordDto): Promise<void> => {
    await apiClient.post<never, ApiResponse<void>>(
      "/auth/forgot/password",
      data
    );
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: AuthResetPasswordDto): Promise<void> => {
    await apiClient.post<never, ApiResponse<void>>(
      "/auth/reset/password",
      data
    );
  },

  /**
   * Login with Google OAuth
   */
  googleLogin: async (data: AuthGoogleLoginDto): Promise<LoginResponseDto> => {
    const response = await apiClient.post<never, ApiResponse<LoginResponseDto>>(
      "/auth/google/login",
      data
    );
    return response.data;
  },

  /**
   * Login with Facebook OAuth
   */
  facebookLogin: async (data: AuthFacebookLoginDto): Promise<LoginResponseDto> => {
    const response = await apiClient.post<never, ApiResponse<LoginResponseDto>>(
      "/auth/facebook/login",
      data
    );
    return response.data;
  },

  /**
   * Login with Apple OAuth
   */
  appleLogin: async (data: AuthAppleLoginDto): Promise<LoginResponseDto> => {
    const response = await apiClient.post<never, ApiResponse<LoginResponseDto>>(
      "/auth/apple/login",
      data
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
