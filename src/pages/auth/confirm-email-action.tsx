import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { authService } from "@/services/auth-service";
import { authStore } from "@/stores/auth-store";
import { confirmEmailRoute } from "@/App";

export default function ConfirmEmailAction() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hash } = confirmEmailRoute.useSearch();
  const hasFired = useRef(false);

  const isAuthenticated = useStore(authStore, (state) => state.isAuthenticated);

  const confirmMutation = useMutation({
    mutationFn: authService.confirmEmail,
    onSuccess: () => {
      toast.success(t("confirmEmail.successTitle"), {
        description: t("confirmEmail.successDesc"),
      });

      if (isAuthenticated) {
        navigate({ to: "/" });
      } else {
        navigate({ to: "/auth/login" });
      }
    },
    onError: () => {
      navigate({ to: "/auth/login" });
    },
  });

  useEffect(() => {
    if (hash && !hasFired.current) {
      hasFired.current = true;
      confirmMutation.mutate({ hash });
    }
  }, [hash]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-6">
      <div className="scale-150">
        <Spinner className="w-12 h-12 text-primary" />
      </div>

      <p className="text-2xl font-semibold text-muted-foreground animate-pulse">
        {t("confirmEmail.verifying")}
      </p>
    </div>
  );
}
