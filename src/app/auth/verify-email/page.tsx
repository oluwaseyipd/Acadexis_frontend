"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import apiService from "@/services/apiService";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // References for shifting focus between inputs
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Timer cooldown logic for resending code
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (index: number, val: string) => {
    // Only accept numeric inputs
    if (val && !/^[0-9]$/.test(val)) return;

    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);
    setErrorMessage(null);

    // Shift focus to the next field if a value is typed
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace shifts focus back to the previous field
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setCode(digits);
    setErrorMessage(null);
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeString = code.join("");
    if (codeString.length < 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await apiService.auth.verifyEmail(email, codeString);
      setSuccessMessage("Email verified successfully! Redirecting you to login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error: unknown) {
      const errWithResponse = error as { response?: { data?: { message?: string; detail?: string } } };
      const message =
        errWithResponse?.response?.data?.message ||
        errWithResponse?.response?.data?.detail ||
        "Verification failed. The code might be incorrect or expired.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setResendLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await apiService.auth.resendVerificationCode(email);
      setSuccessMessage("A new verification code has been sent to your email.");
      setCooldown(60); // 60 seconds cooldown
    } catch (error: unknown) {
      const errWithResponse = error as { response?: { data?: { message?: string; detail?: string } } };
      const message =
        errWithResponse?.response?.data?.message ||
        errWithResponse?.response?.data?.detail ||
        "Failed to resend code. Please try again later.";
      setErrorMessage(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[480px] flex flex-col items-center gap-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex flex-col items-center gap-3 text-center mb-4">
        <div className="w-[52px] h-[52px] rounded-[14px] bg-[#0f173e] flex items-center justify-center text-green-500">
          <GraduationCap size={24} strokeWidth={1.8} />
        </div>

        <h1 className="text-[2rem] font-bold text-[#0f173e] tracking-tight leading-tight font-serif">
          Verify Your Email
        </h1>

        <p className="text-sm text-gray-500 leading-relaxed max-w-[340px]">
          We sent a 6-digit verification code to <strong className="text-gray-700">{email || "your registered email"}</strong>.
        </p>
      </header>

      {/* ── Card ───────────────────────────────────────────────────────── */}
      <div className="w-full bg-white rounded-4xl px-8 py-9 flex flex-col gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_32px_rgba(15,23,62,0.08)]">
        {/* Success Alert */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="flex flex-col gap-8">
          {/* 6-Digit Code Fields */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-800 text-center">
              Verification Code
            </label>
            <div className="flex justify-between gap-2.5 max-w-[320px] mx-auto">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    if (el) inputRefs.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={idx === 0 ? handlePaste : undefined}
                  className="w-12 h-14 bg-gray-50 border border-gray-200 text-center text-xl font-bold text-gray-900 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-150"
                  autoFocus={idx === 0}
                />
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading || code.join("").length < 6}
            className="w-full flex items-center justify-center gap-2 bg-[#0f173e] hover:bg-[#1a2456] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 text-base transition-all duration-200"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Verifying code…
              </>
            ) : (
              "Verify Email →"
            )}
          </button>
        </form>

        {/* Resend Actions */}
        <div className="flex flex-col items-center gap-3 mt-2">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive a code?{" "}
            {cooldown > 0 ? (
              <span className="font-semibold text-gray-700">
                Resend in {cooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-all duration-150 inline-flex items-center gap-1 disabled:opacity-50"
              >
                {resendLoading && <RefreshCw size={12} className="animate-spin" />}
                Resend Code
              </button>
            )}
          </p>

          <a
            href="/auth/login"
            className="text-xs font-semibold text-gray-400 hover:text-[#0f173e] flex items-center gap-1 transition-colors mt-2"
          >
            <ArrowLeft size={14} /> Back to Login
          </a>
        </div>
      </div>

      {/* Legal Footer */}
      <footer className="text-center text-[0.8125rem] text-gray-400 mt-6">
        © {new Date().getFullYear()} The Digital Athenaeum. All academic rights reserved.
      </footer>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#eef2f0] px-4 py-10">
      {/* Radial background accents */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(34,197,94,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(15,23,62,0.06) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <Suspense fallback={
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-4 border-gray-200 border-t-green-500 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading verification panel...</p>
        </div>
      }>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}
