import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

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
import { Key } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { LanguageSwitcher } from "./components/language-switcher";
import { useTranslation } from "react-i18next";

const forgotPasswordSchema = z.object({
  email: z.email("forgotPassword.validation.emailInvalid"),
});

type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordPayload) => {
      return await authService.forgotPassword(data);
    },
    onSuccess: () => {
      setEmailSent(true);
      toast.success(t("forgotPassword.toastSuccess"));
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      forgotPasswordMutation.mutate(value);
    },
  });

  return (
    <div className="h-screen w-full relative overflow-hidden font-sans text-slate-900">
      {/* Global Styles & Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes kenBurns { 0% { transform: scale(1.1); } 100% { transform: scale(1); } }

        .animate-ken-burns { animation: kenBurns 10s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-in { animation: slideIn 0.6s ease-out forwards; }
        
        .delay-100 { animation-delay: 100ms; }

        .form-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
      `}</style>

      {/* FULL SCREEN BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="https://images.unsplash.com/photo-1737174656906-e4310197c63f?q=80&w=2000&auto=format&fit=crop"
          alt="Nature Background"
          className="w-full h-full object-cover opacity-90 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      <div className="absolute z-50 top-4 right-4 md:top-8 md:right-8">
        <LanguageSwitcher />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* Floating Card */}
        <Card className="w-full max-w-[480px] perspective-1000">
          {/* Back Button */}

          {/* Header */}
          <CardHeader className="text-center space-y-2">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/login" })}
              className="w-fit"
            >
              <ArrowLeft />
              {t("forgotPassword.backToLogin")}
            </Button>
            <CardTitle className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Key />
            </CardTitle>
            <h2 className="text-3xl font-bold ">{t("forgotPassword.title")}</h2>
            <CardDescription>
              {emailSent
                ? t("forgotPassword.subtitleSent")
                : t("forgotPassword.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <>
                {/* Form */}
                <form
                  id="forgot-password-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="space-y-5"
                >
                  <FieldGroup>
                    <form.Field
                      name="email"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              {t("forgotPassword.emailLabel")}
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              type="email"
                              placeholder="name@example.com"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending ? (
                        <>
                          <Spinner />
                          {t("forgotPassword.sending")}
                        </>
                      ) : (
                        t("forgotPassword.submit")
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-primary">
                  <p className="font-medium mb-1">
                    {t("forgotPassword.successBox.title")}
                  </p>
                  <p className="text-primary/90">
                    {t("forgotPassword.successBox.text")}
                  </p>
                </div>

                <Button onClick={() => navigate({ to: "/login" })}>
                  {t("forgotPassword.backToLogin").toUpperCase()}
                </Button>

                <Button onClick={() => setEmailSent(false)} variant="secondary">
                  {t("forgotPassword.retry")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
