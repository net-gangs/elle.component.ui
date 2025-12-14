import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { Spinner } from "@/components/ui/spinner";

import { authService } from "@/services/auth-service";
import { authActions } from "@/stores/auth-store";
import type { LoginResponseDto } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "./components/language-switcher";

const loginSchema = z.object({
  email: z.email("login.validation.emailInvalid"),
  password: z.string().min(1, "login.validation.passwordRequired"),
});

type LoginPayload = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

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

  const loginMutation = useMutation({
    mutationFn: async (data: LoginPayload) => {
      return await authService.login(data);
    },
    onSuccess: (response: LoginResponseDto) => {
      authActions.login(response);
      navigate({ to: "/" });
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (code: string) => {
      return await authService.googleLogin({ code });
    },
    onSuccess: (response: LoginResponseDto) => {
      authActions.login(response);
      navigate({ to: "/" });
    },
  });

  const performGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (codeResponse) => {
      googleLoginMutation.mutate(codeResponse.code);
    },
  });

  // const facebookLoginMutation = useMutation({
  //   mutationFn: async (accessToken: string) => {
  //     return await authService.facebookLogin({ accessToken });
  //   },
  //   onSuccess: (response: LoginResponseDto) => {
  //     authActions.login(response);
  //     navigate({ to: "/" });
  //   },
  //   onError: (error: any) => {
  //     toast.error(error?.response?.data?.message || "Facebook login failed");
  //   },
  // });

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
      if ((window as any).FB) return;

      (window as any).fbAsyncInit = function () {
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
      {/* Global Styles & Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes kenBurns { 0% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-up {
          animation: slideUpFade 1s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }

        .animate-ken-burns { animation: kenBurns 10s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-in { animation: slideIn 0.6s ease-out forwards; }
        
        .slide-enter { animation: fadeIn 0.5s ease-out forwards; }
        .slide-exit { animation: fadeOut 0.5s ease-out forwards; }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
       
      `}</style>
      {/* FULL SCREEN BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="https://images.unsplash.com/photo-1482686115713-0fbcaced6e28?q=80&w=2000&auto=format&fit=crop"
          alt="Nature Background"
          className="w-full h-full object-cover opacity-90 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent"></div>
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
                  onClick={() => api?.scrollTo(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-8 bg-primary opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      : "w-4 bg-primary/40 hover:bg-primary/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
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
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label
                        htmlFor="rememberMe"
                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      >
                        {t("login.rememberMe")}
                      </Label>
                    </div>
                    <a
                      href="/auth/forgot-password"
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
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Spinner />
                        {t("login.loading")}
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
                >
                  {googleLoginMutation.isPending ? (
                    <Spinner />
                  ) : (
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      className="w-5 h-5"
                      alt="Google"
                    />
                  )}
                  {t("login.social.google")}
                </Button>

                {/* <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).FB) {
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
                  href="/auth/signup"
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
