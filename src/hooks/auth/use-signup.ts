import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authService } from "@/services/auth-service";
import { useTranslation } from "react-i18next";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

export function useSignup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const nameParts = (data.name ?? "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || firstName;

      return await authService.register({
        email: data.email,
        password: data.password,
        firstName,
        lastName,
      });
    },
    onSuccess: () => {
      toast.success(t("signup.successMessage"));
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 2000);
    },
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    showPassword,
    togglePasswordVisibility,
    signupMutation,
  };
}
