import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLogin } from "@/hooks/auth/use-login";
import { useCarousel } from "@/hooks/common/use-carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { LanguageSwitcher } from "./components/language-switcher";
import { loginRoute, signupRoute, forgotPasswordRoute } from "@/app/router";

const loginSchema = z.object({
  email: z.email("login.validation.emailInvalid"),
  password: z.string().min(1, "login.validation.passwordRequired"),
});

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const search = loginRoute.useSearch();

  const {
    showPassword,
    rememberMe,
    togglePasswordVisibility,
    toggleRememberMe,
    loginMutation,
    googleLoginMutation,
    performGoogleLogin,
  } = useLogin(search.redirect);

  const { currentSlide, setApi, goToSlide } = useCarousel();

  // Carousel Data
  const slides = [
    {
      title: t("login.slides.slide1.title"),
      desc: t("login.slides.slide1.desc"),
    },
    {
      title: t("login.slides.slide2.title"),
      desc: t("login.slides.slide2.desc"),
    },
    {
      title: t("login.slides.slide3.title"),
      desc: t("login.slides.slide3.desc"),
    },
  ];

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value);
    },
  });

  useEffect(() => {
    const loadFacebookSDK = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- FB SDK attaches to window at runtime
      if ((window as any).FB) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- FB SDK attaches to window at runtime
      (window as any).fbAsyncInit = function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- FB init expects any-typed config
        (window as any).FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID || "",
          cookie: true,
          xfbml: true,
          version: "v18.0",
        });
      };

      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* FULL SCREEN BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="https://images.unsplash.com/photo-1482686115713-0fbcaced6e28?q=80&w=2000&auto=format&fit=crop"
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
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 py-12">
        {/* LEFT SIDE: Brand & Visuals */}
        <div className="flex flex-col justify-between h-full max-w-lg text-secondary py-8 lg:py-0 w-full lg:w-auto">
          <div className="opacity-0 animate-fade-in">
            <h2 className="text-2xl font-bold tracking-wider flex items-center gap-2">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              ELLA AI
            </h2>
          </div>

          <div className="mt-auto lg:mb-20">
            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
                duration: 40,
              }}
              plugins={[
                Autoplay({
                  delay: 5000,
                }),
                Fade(),
              ]}
              className="w-full max-w-lg"
            >
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div
                      className={`h-[300px] select-none flex flex-col justify-end pb-10
                        ${
                          currentSlide === index
                            ? "animate-slide-up opacity-100"
                            : "slide-exit"
                        }`}
                    >
                      <h1
                        className="text-4xl lg:text-6xl font-bold leading-tight drop-shadow-lg"
                        dangerouslySetInnerHTML={{ __html: slide.title }}
                      />
                      <p className="text-lg max-w-sm drop-shadow-md mt-6">
                        {slide.desc}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="flex gap-2 opacity-0 animate-fade-in delay-300">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-8 bg-primary opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      : "w-4 bg-primary/40 hover:bg-primary/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={currentSlide === index ? "true" : "false"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form (Floating Card) */}
        <div className="w-full max-w-[480px] perspective-1000">
          <Card className="px-2 lg:px-4">
            {/* Header */}
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                {t("login.title")}
              </CardTitle>
              <CardDescription>{t("login.subtitle")}</CardDescription>
            </CardHeader>

            {/* Form */}
            <CardContent>
              <form
                id="login-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-5"
              >
                <FieldGroup>
                  {/* Email Field */}
                  <form.Field
                    name="email"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            {t("login.emailLabel")}
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="email"
                            placeholder="name@example.com"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Password Field */}
                  <form.Field
                    name="password"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            {t("login.passwordLabel")}
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              id={field.name}
                              name={field.name}
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label={
                                showPassword
                                  ? t("login.hidePassword")
                                  : t("login.showPassword")
                              }
                            >
                              {showPassword ? (
                                <EyeOff size={18} aria-hidden="true" />
                              ) : (
                                <Eye size={18} aria-hidden="true" />
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

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={rememberMe}
                        onCheckedChange={toggleRememberMe}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        aria-describedby="rememberMe-label"
                      />
                      <Label
                        id="rememberMe-label"
                        htmlFor="rememberMe"
                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      >
                        {t("login.rememberMe")}
                      </Label>
                    </div>
                    <a
                      href="/forgot-password"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate({ to: forgotPasswordRoute.fullPath });
                      }}
                      className="text-sm font-medium text-foreground hover:text-primary hover:underline transition-colors"
                    >
                      {t("login.forgotPassword")}
                    </a>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    aria-busy={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Spinner aria-hidden="true" />
                        <span>{t("login.loading")}</span>
                      </>
                    ) : (
                      t("login.submit")
                    )}
                  </Button>
                </FieldGroup>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <Separator className="absolute inset-1.5" />

                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-muted-foreground backdrop-blur-sm">
                    {t("login.orDivider")}
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => performGoogleLogin()}
                  disabled={googleLoginMutation.isPending}
                  className="w-full h-12"
                  aria-busy={googleLoginMutation.isPending}
                >
                  {googleLoginMutation.isPending ? (
                    <Spinner aria-hidden="true" />
                  ) : (
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      className="w-5 h-5"
                      alt=""
                      aria-hidden="true"
                    />
                  )}
                  <span>{t("login.social.google")}</span>
                </Button>

                {/* <button
                type="button"
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- FB SDK runtime types
                  if (typeof window !== 'undefined' && (window as any).FB) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- response shape is dynamic from FB SDK
                    (window as any).FB.login((response: any) => {
                      if (response.authResponse && response.authResponse.accessToken) {
                        facebookLoginMutation.mutate(response.authResponse.accessToken);
                      } else {
                        toast.error("Facebook login failed");
                      }
                    }, { scope: 'public_profile,email' });
                  } else {
                    toast.info("Facebook SDK not loaded. Please configure Facebook App ID.");
                  }
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-all"
              >
                <img
                  src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                  className="w-5 h-5"
                  alt="Facebook"
                />
                <span>Sign in with Facebook</span>
              </button>

              <button
                type="button"
                onClick={() => toast.info("Apple login coming soon")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span>Sign in with Apple</span>
              </button> */}
              </div>
            </CardContent>

            <CardFooter className="justify-center">
              <div className="text-center text-sm text-muted-foreground">
                {t("login.newUser")}{" "}
                <a
                  href="/signup"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ to: signupRoute.fullPath });
                  }}
                  className="font-bold text-foreground hover:text-primary hover:underline transition-colors"
                >
                  {t("login.signUpLink")}
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
