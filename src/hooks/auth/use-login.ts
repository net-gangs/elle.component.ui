import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { authService } from "@/services/auth-service";
import { authActions } from "@/stores/auth-store";
import type { LoginResponseDto } from "@/types/auth";

export interface LoginFormData {
  email: string;
  password: string;
}

export function useLogin(redirectTo: string = "/") {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await authService.login(data);
    },
    onSuccess: (response: LoginResponseDto) => {
      authActions.login(response);
      navigate({ to: redirectTo });
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (code: string) => {
      return await authService.googleLogin({ code });
    },
    onSuccess: (response: LoginResponseDto) => {
      authActions.login(response);
      navigate({ to: redirectTo });
    },
  });

  const performGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (codeResponse) => {
      googleLoginMutation.mutate(codeResponse.code);
    },
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleRememberMe = useCallback(() => {
    setRememberMe((prev) => !prev);
  }, []);

  return {
    showPassword,
    rememberMe,
    togglePasswordVisibility,
    toggleRememberMe,
    loginMutation,
    googleLoginMutation,
    performGoogleLogin,
  };
}
