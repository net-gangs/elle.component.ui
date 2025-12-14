import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/services/auth-service";
import { useTranslation } from "react-i18next";

export interface ForgotPasswordFormData {
  email: string;
}

export function useForgotPassword() {
  const { t } = useTranslation();
  const [emailSent, setEmailSent] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      return await authService.forgotPassword(data);
    },
    onSuccess: () => {
      setEmailSent(true);
      toast.success(t("forgotPassword.toastSuccess"));
    },
  });

  return {
    emailSent,
    forgotPasswordMutation,
  };
}
