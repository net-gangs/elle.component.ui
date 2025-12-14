import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSignup } from "@/hooks/auth/use-signup";
import { useCarousel } from "@/hooks/common/use-carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { LanguageSwitcher } from "./components/language-switcher";

const signupSchema = z.object({
  name: z.string().min(2, "signup.validation.nameRequired"),
  email: z.email("signup.validation.emailInvalid"),
  password: z.string().min(6, "signup.validation.passwordTooShort"),
});

export default function Signup() {
  const { t } = useTranslation();

  const { showPassword, togglePasswordVisibility, signupMutation } = useSignup();
  const { currentSlide, setApi, goToSlide } = useCarousel();

  const slides = [
    {
      title: t("signup.slides.slide1.title"),
      desc: t("signup.slides.slide1.desc"),
    },
    {
      title: t("signup.slides.slide2.title"),
      desc: t("signup.slides.slide2.desc"),
    },
    {
      title: t("signup.slides.slide3.title"),
      desc: t("signup.slides.slide3.desc"),
    },
  ];

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      signupMutation.mutate(value);
    },
  });

  return (
    <div className="h-screen w-full relative overflow-hidden font-sans text-slate-900">
      {/* FULL SCREEN BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="https://images.unsplash.com/photo-1496459169807-866e74594fa8?q=80&w=2000&auto=format&fit=crop"
          alt="Nature Background"
          className="w-full h-full object-cover opacity-90 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" aria-hidden="true"></div>
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

        {/* RIGHT SIDE: Signup Form (Floating Card) */}
        <div className="w-full max-w-[480px] perspective-1000 mt-8 lg:mt-0">
          <Card className="px-2 lg:px-4">
            {/* Header */}
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                {t("signup.title")}
              </CardTitle>
              <CardDescription>{t("signup.subtitle")}</CardDescription>
            </CardHeader>

            {/* Form */}
            <CardContent>
              <form
                id="signup-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-5"
              >
                <FieldGroup>
                  <form.Field
                    name="name"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            {t("signup.nameLabel")}
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="text"
                            placeholder="John Doe"
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

                  <form.Field
                    name="email"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            {t("signup.emailLabel")}
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="email"
                            placeholder="name@example.com"
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

                  <form.Field
                    name="password"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            {t("signup.passwordLabel")}
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
                              aria-label={showPassword ? t("signup.hidePassword") : t("signup.showPassword")}
                            >
                              {showPassword ? (
                                <EyeOff size={20} aria-hidden="true" />
                              ) : (
                                <Eye size={20} aria-hidden="true" />
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

                  <Button 
                    type="submit" 
                    disabled={signupMutation.isPending}
                    className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    aria-busy={signupMutation.isPending}
                  >
                    {signupMutation.isPending ? (
                      <>
                        <Spinner aria-hidden="true" />
                        <span>{t("signup.loading")}</span>
                      </>
                    ) : (
                      t("signup.submit")
                    )}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>

            <CardFooter className="justify-center">
              <div className="text-center text-sm text-muted-foreground mt-6">
                {t("signup.existingUser")}{" "}
                <a href="/auth/login" className="font-bold hover:underline">
                  {t("signup.signInLink")}
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
