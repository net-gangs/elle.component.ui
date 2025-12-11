import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { authService } from "@/services/auth-service";
import { Input } from "@/components/ui/input";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordPayload) => {
      return await authService.forgotPassword(data);
    },
    onSuccess: () => {
      setEmailSent(true);
      toast.success("Password reset email sent! Please check your inbox.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send reset email");
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
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop"
          alt="Nature Background"
          className="w-full h-full object-cover opacity-90 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-6">
        {/* Floating Card */}
        <div className="w-full max-w-[480px] perspective-1000">
          <div className="form-card w-full rounded-3xl shadow-2xl p-8 lg:p-10 relative opacity-0 animate-slide-in delay-100">
            {/* Back Button */}
            <button
              onClick={() => navigate({ to: "/login" })}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition mb-6"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Login</span>
            </button>

            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Forgot Password?</h2>
              <p className="text-slate-600 text-sm">
                {emailSent
                  ? "We've sent password reset instructions to your email."
                  : "No worries, we'll send you reset instructions."}
              </p>
            </div>

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
                  <form.Field
                    name="email"
                    children={(field) => (
                      <div className="space-y-1 group focus-within:text-primary">
                        <label className="text-sm font-medium text-slate-600 ml-1 transition-colors group-focus-within:text-primary">
                          Email Address
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

                  <button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="w-full bg-[#1a1a1a] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-slate-900/10 active:scale-[0.99] disabled:opacity-50"
                  >
                    {forgotPasswordMutation.isPending ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "SEND RESET LINK"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-primary">
                  <p className="font-medium mb-1">Check your email</p>
                  <p className="text-primary/90">
                    We've sent a password reset link to your email address. Please check your inbox
                    and follow the instructions.
                  </p>
                </div>

                <button
                  onClick={() => navigate({ to: "/login" })}
                  className="w-full bg-[#1a1a1a] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-slate-900/10 active:scale-[0.99]"
                >
                  BACK TO LOGIN
                </button>

                <button
                  onClick={() => setEmailSent(false)}
                  className="w-full text-slate-600 hover:text-slate-900 text-sm font-medium transition"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
