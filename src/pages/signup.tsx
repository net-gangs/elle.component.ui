import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { authService } from "@/services/auth-service";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupPayload = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Carousel Data
  const slides = [
    {
      title: "Join the <br/>Future...",
      desc: "Create your account and experience the next generation of artificial intelligence.",
    },
    {
      title: "Powerful <br/>Features",
      desc: "Access advanced AI capabilities designed to enhance your productivity and creativity.",
    },
    {
      title: "Your Data, <br/>Protected",
      desc: "Enterprise-grade security ensures your information is safe and private.",
    },
  ];

  const signupMutation = useMutation({
    mutationFn: async (data: SignupPayload) => {
      const nameParts = data.name.trim().split(" ");
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
      toast.success(
        "Account created! Please check your email to verify your account."
      );
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create account");
    },
  });

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
      `}</style>

      {/* FULL SCREEN BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop"
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

        {/* RIGHT SIDE: Signup Form (Floating Card) */}
        <div className="w-full max-w-[480px] perspective-1000 mt-8 lg:mt-0">
          <div className="form-card w-full rounded-3xl shadow-2xl p-8 lg:p-10 relative opacity-0 animate-slide-in delay-100">
            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                Get Started
              </span>
              <h2 className="text-3xl font-bold text-slate-900">
                Create Account
              </h2>
            </div>

            {/* Form */}
            <form
              id="signup-form"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-5"
            >
              <form.Field
                name="name"
                children={(field) => (
                  <div className="space-y-1 group focus-within:text-primary">
                    <label className="text-sm font-medium text-slate-600 ml-1 transition-colors group-focus-within:text-primary">
                      Name
                    </label>
                    <Input
                      id={field.name}
                      type="text"
                      placeholder="John Doe"
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
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
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

              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full bg-[#1a1a1a] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-slate-900/10 active:scale-[0.99] disabled:opacity-50"
              >
                {signupMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <Spinner />
                    Creating Account...
                  </span>
                ) : (
                  "CREATE ACCOUNT"
                )}
              </button>
            </form>

            <div className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-bold text-slate-900 hover:underline"
              >
                SIGN IN HERE
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
