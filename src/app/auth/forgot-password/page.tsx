"use client";

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, MessageSquare, LockOpenIcon } from "lucide-react";
import apiService from "@/services/apiService";
import AuthNavbar from "@/components/AuthNavbar";
import AuthFooter from "@/components/AuthFooter";

function EmailNotification() {
  return (
    <div className="relative w-full max-w-[480px] flex flex-col items-center gap-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <div className="w-[52px] h-[52px] rounded-full bg-green-500 flex items-center justify-center text-[#0f173e] shadow-md">
          <MessageSquare size={26} strokeWidth={1.8} />
        </div>
        <h1 className="text-[2rem] font-bold text-[#0f173e] tracking-tight leading-tight font-serif">
          Check Your Inbox
        </h1>
        <p className="text-gray-500 leading-relaxed max-w-[300px]">
          If an account exists for the email you entered, you should receive a password reset link shortly.
        </p>
      </header>

      <div className="w-full p-8 flex flex-col items-center gap-4 text-center">
        <a 
          href="/auth/login"
          className="w-full flex items-center justify-center gap-2 bg-[#0f173e] hover:bg-[#1a2456] active:scale-[0.99] text-white font-medium rounded-xl py-3.5 transition-all text-center"
        >
          Return to Login
        </a>
        <p className="text-sm text-gray-500">Didn&apos;t receive the email?</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-green-500 font-medium hover:underline"
        >
          Resend link
        </button>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError(null);

    try {
      await apiService.auth.forgotPassword(email);
      setIsSubmitted(true);
    } catch (error: unknown) {
      const errWithResponse = error as { response?: { data?: { message?: string; detail?: string } } };
      const message =
        errWithResponse?.response?.data?.message ||
        errWithResponse?.response?.data?.detail ||
        "An error occurred. Please try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#eef2f0]"> 
      <AuthNavbar />
  
      <div className="flex items-center justify-center px-4 py-10">
        <div className="pointer-events-none fixed inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(34,197,94,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(15,23,62,0.06) 0%, transparent 60%)" }} aria-hidden="true" />

        {isSubmitted ? (
          <EmailNotification />
        ) : (
          <div className="relative w-full max-w-[480px] flex flex-col items-center gap-6">
            <header className="flex flex-col items-center gap-3 text-center">
              <div className="w-[52px] h-[52px] rounded-full bg-[#0f173e] flex items-center justify-center text-green-500 shadow-md">
                <LockOpenIcon size={26} strokeWidth={1.8} />
              </div>
              <h1 className="text-[2rem] font-bold text-[#0f173e] tracking-tight leading-tight font-serif">
                Reset Your Password
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[300px]">
                Enter your university email address and we&apos;ll send you a link.
              </p>
            </header>

            <div className="w-full bg-white rounded-lg shadow-md p-8">
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                {serverError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4" role="alert">
                    {serverError}
                  </div>
                )}

                <div className="flex flex-col gap-1 mb-8">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
                    University Email
                  </label>
                  <input
                    required
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="professor@university.edu"
                    className="border-b border-gray-300 text-[#0f173e] text-sm py-2 px-1 focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#0f173e] hover:bg-[#1a2456] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 transition-all"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset link
                      <ArrowRightIcon size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            <a href="/auth/login" className="flex items-center gap-2 text-green-500">
              <ArrowLeftIcon size={16} /> Return to Login
            </a>
          </div>
        )}
      </div>

      <AuthFooter />
    </main>
  );
}
