import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router"; // Assuming TanStack Router
import * as z from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";

import { authService } from "@/services/auth-service";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { passwordChangeRoute } from "@/App";
import { LanguageSwitcher } from "./components/language-switcher";

const passwordChangeSchema = z
  .object({
    password: z.string().min(6, "passwordChange.validation.passwordMin"),
    confirmPassword: z.string(),
    hash: z.string().min(1, "passwordChange.validation.missingHash"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordChange.validation.match",
    path: ["confirmPassword"],
  });

type PasswordChangePayload = z.infer<typeof passwordChangeSchema>;

export default function PasswordChange() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hash } = passwordChangeRoute.useSearch();

  const [showPassword, setShowPassword] = useState(false);

  const resetMutation = useMutation({
    mutationFn: async (data: PasswordChangePayload) => {
      return await authService.resetPassword(data);
    },
    onSuccess: () => {
      toast.success(t("passwordChange.success"));
      navigate({ to: "/auth/login" });
    },
  });

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
      hash,
    },
    validators: {
      onChange: passwordChangeSchema,
    },
    onSubmit: async ({ value }) => {
      if (!hash) {
        toast.error(t("passwordChange.invalidLink"));
        return;
      }
      resetMutation.mutate(value);
    },
  });

  // 3. Render Form
  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Global Styles & Animations */}
      <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes kenBurns { 0% { transform: scale(1.1); } 100% { transform: scale(1); } }

          .animate-ken-burns { animation: kenBurns 10s ease-out forwards; }
        `}</style>

      {/* FULL SCREEN BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="https://images.unsplash.com/photo-1620474711240-e5f4acfa6752?q=80&w=2000&auto=format&fit=crop"
          alt="Nature Background"
          className="w-full h-full object-cover opacity-90 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      <div className="absolute z-50 top-4 right-4 md:top-8 md:right-8">
        <LanguageSwitcher />
      </div>
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <Card className="w-full max-w-[480px]">
          <CardHeader className="text-center">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/auth/login" })}
              className="w-fit"
            >
              <ArrowLeft />
              {t("common.backToLogin")}
            </Button>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <LockKeyhole className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {t("passwordChange.title")}
            </CardTitle>
            <CardDescription>{t("passwordChange.subtitle")}</CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-5"
            >
              <FieldGroup>
                {/* New Password */}
                <form.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>
                          {t("passwordChange.newPassword")}
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            id={field.name}
                            name={field.name}
                            type={showPassword ? "text" : "password"}
                            placeholder={t(
                              "passwordChange.newPasswordPlaceholder"
                            )}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Confirm Password */}
                <form.Field
                  name="confirmPassword"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>
                          {t("passwordChange.confirmPassword")}
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          placeholder={t(
                            "passwordChange.confirmPasswordPlaceholder"
                          )}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={resetMutation.isPending}
                >
                  {resetMutation.isPending ? (
                    <>
                      <Spinner />
                      {t("passwordChange.submitting")}
                    </>
                  ) : (
                    t("passwordChange.submit")
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
