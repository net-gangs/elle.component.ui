import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

import { authService } from "@/services/auth-service";
import { authActions } from "@/stores/auth-store";
import type { LoginResponseDto } from "@/types/auth";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginPayload = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Carousel Data
  const slides = [
    {
      title: "Building the <br/>Future...",
      desc: "Experience the next generation of artificial intelligence, designed to adapt to your nature.",
    },
    {
      title: "Seamless <br/>Integration",
      desc: "Connect your workflow effortlessly with our advanced plugins and API support.",
    },
    {
      title: "Secure by <br/>Default",
      desc: "Enterprise-grade encryption and privacy controls to keep your data safe and sound.",
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
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (idToken: string) => {
      return await authService.googleLogin({ idToken });
    },
    onSuccess: (response: LoginResponseDto) => {
      authActions.login(response);
      navigate({ to: "/" });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Google login failed");
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

  // Carousel Logic
  const changeSlide = (index: number) => {
    if (index === currentSlide || isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentSlide(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    changeSlide(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  useEffect(() => {
    const loadFacebookSDK = () => {
      if ((window as any).FB) return;

      (window as any).fbAsyncInit = function() {
        (window as any).FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
      };

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden font-sans text-slate-900">
      {/* Global Styles & Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes kenBurns { 0% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

        .animate-ken-burns { animation: kenBurns 10s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-in { animation: slideIn 0.6s ease-out forwards; }
        
        .slide-enter { animation: fadeIn 0.5s ease-out forwards; }
        .slide-exit { animation: fadeOut 0.5s ease-out forwards; }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }

        .form-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .social-btn:hover { background-color: #f8fafc; transform: translateY(-1px); border-color: #cbd5e1; }
      `}</style>

      {/* FULL SCREEN BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2000&auto=format&fit=crop"
          alt="Nature Background"
          className="w-full h-full object-cover opacity-90 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 py-12">
        {/* LEFT SIDE: Brand & Visuals */}
        <div className="flex flex-col justify-between h-full max-w-lg text-white py-8 lg:py-0 w-full lg:w-auto">
          <div className="opacity-0 animate-fade-in">
            <h2 className="text-2xl font-bold tracking-wider flex items-center gap-2">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              ELLA AI
            </h2>
          </div>

          <div className="space-y-6 mt-auto lg:mb-20">
            <div className="min-h-[180px] transition-all duration-500">
              <h1
                className={`text-4xl lg:text-6xl font-bold leading-tight shadow-black drop-shadow-lg ${
                  isTransitioning ? "slide-exit" : "slide-enter"
                }`}
                dangerouslySetInnerHTML={{ __html: slides[currentSlide].title }}
              />
              <p
                className={`text-slate-200 text-lg max-w-sm drop-shadow-md mt-6 ${
                  isTransitioning ? "slide-exit" : "slide-enter"
                }`}
              >
                {slides[currentSlide].desc}
              </p>
            </div>

            <div className="flex gap-2 mt-8 opacity-0 animate-fade-in delay-300">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-8 bg-white opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      : "w-4 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form (Floating Card) */}
        <div className="w-full max-w-[480px] perspective-1000 mt-8 lg:mt-0">
          <div className="form-card w-full rounded-3xl shadow-2xl p-8 lg:p-10 relative opacity-0 animate-slide-in delay-100">
            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                Welcome Back
              </span>
              <h2 className="text-3xl font-bold text-slate-900">Log In</h2>
            </div>

            {/* Form */}
            <form
              id="login-form"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-5"
            >
              <form.Field
                name="email"
                children={(field) => (
                  <div className="space-y-1 group focus-within:text-primary">
                    <label className="text-sm font-medium text-slate-600 ml-1 transition-colors group-focus-within:text-primary">
                      Email
                    </label>
                    <Input
                      id={field.name}
                      type="email"
                      placeholder="name@example.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none ${
                        field.state.meta.errors.length ? "border-red-500" : ""
                      }`}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500 ml-1">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="password"
                children={(field) => (
                  <div className="space-y-1 group">
                    <label className="text-sm font-medium text-slate-600 ml-1 transition-colors group-focus-within:text-primary">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none ${
                          field.state.meta.errors.length ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500 ml-1">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-slate-500 group-hover:text-slate-700 transition">
                    Remember me
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ to: "/forgot-password" });
                  }}
                  className="font-medium text-slate-900 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-[#1a1a1a] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-slate-900/10 active:scale-[0.99] disabled:opacity-50"
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "CONTINUE"
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 px-2 text-slate-400 backdrop-blur-sm">
                  Or
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
                <div className="w-full [&>div]:w-full [&_button]:!w-full [&_button]:!px-4 [&_button]:!py-3 [&_button]:!rounded-xl [&_button]:!border-slate-200 [&_button]:!shadow-none hover:[&_button]:!bg-slate-50 [&_button]:!transition-all">
                  <GoogleLogin
                    context="signin"
                    onSuccess={(credentialResponse) => {
                      if (credentialResponse.credential) {
                        googleLoginMutation.mutate(credentialResponse.credential);
                      }
                    }}
                    onError={() => {
                      toast.error("Google login failed");
                    }}
                    text="signin_with"
                    theme="outline"
                    size="large"
                  />
                </div>
              </GoogleOAuthProvider>

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

            <div className="text-center text-sm text-slate-500 mt-6">
              New User?{" "}
              <a
                href="/signup"
                onClick={(e) => {
                  e.preventDefault();
                  navigate({ to: "/signup" });
                }}
                className="font-bold text-slate-900 hover:underline"
              >
                SIGN UP HERE
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
