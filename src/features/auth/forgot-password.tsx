import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { ArrowLeft, Key } from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { LanguageSwitcher } from "./components/language-switcher";
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";
import { loginRoute } from "@/app/router";

const forgotPasswordSchema = z.object({
  email: z.email("forgotPassword.validation.emailInvalid"),
});

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { emailSent, forgotPasswordMutation, setEmailSent } =
    useForgotPassword();

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
      {/* FULL SCREEN BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="https://images.unsplash.com/photo-1737174656906-e4310197c63f?q=80&w=2000&auto=format&fit=crop"
          alt="Nature Background"
          className="w-full h-full object-cover opacity-90 animate-ken-burns"
        />
        <div
          className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent"
          aria-hidden="true"
        ></div>
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
              onClick={() => navigate({ to: loginRoute.fullPath })}
              className="w-fit"
              aria-label={t("forgotPassword.backToLogin")}
            >
              <ArrowLeft aria-hidden="true" />
              <span>{t("forgotPassword.backToLogin")}</span>
            </Button>
            <CardTitle className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Key aria-hidden="true" />
            </CardTitle>
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
                              aria-invalid={isInvalid}
                              aria-describedby={
                                isInvalid ? `${field.name}-error` : undefined
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
                      className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                      aria-busy={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending ? (
                        <>
                          <Spinner aria-hidden="true" />
                          <span>{t("forgotPassword.sending")}</span>
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
                <div
                  className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-primary"
                  role="status"
                  aria-live="polite"
                >
                  <p className="font-medium mb-1">
                    {t("forgotPassword.successBox.title")}
                  </p>
                  <p className="text-primary/90">
                    {t("forgotPassword.successBox.text")}
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <Button
                    onClick={() => navigate({ to: "/auth/login" })}
                    className="w-full"
                  >
                    {t("common.backToLogin")}
                  </Button>

                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    {t("forgotPassword.retry")}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
