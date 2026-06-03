"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield } from "lucide-react";
import adminService from "@/services/adminService";
import { tokenStorage } from "@/services/api-client";

// ─── Validation Schema ────────────────────────────────────────────────────────
// Admin login does NOT require university email - just a valid email
const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { rememberMe: false },
  });

  // ── Credential login ────────────────────────────────────────────────────────
  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Use adminService.login() which goes directly to /auth/login (NOT /api/auth/login)
      // Django admin expects username (email is used as username)
      const { access, refresh, user } = await adminService.login({
        username: data.email, // Use email as username for Django admin
        password: data.password,
      });

      // Verify user is an admin
      if (user.role !== "admin") {
        setServerError("Access denied. Admin credentials required.");
        tokenStorage.clearAll();
        return;
      }

      tokenStorage.setToken(access);
      tokenStorage.setRefreshToken(refresh);
      if (typeof window !== "undefined") {
        document.cookie = `access_token=${access}; path=/; max-age=${60 * 60}; SameSite=Lax`;
        document.cookie = `refresh_token=${refresh}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      }

      router.push("/dashboard/admin");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Invalid credentials. Please try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-10">
      {/* Subtle background radial accents */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(34,197,94,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(59,130,246,0.06) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[420px] flex flex-col items-center gap-6">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="flex flex-col items-center gap-3 text-center mb-4">
          <div className="w-[56px] h-[56px] rounded-[16px] bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
            <Shield size={26} strokeWidth={1.8} />
          </div>

          <h1 className="text-[2rem] font-bold text-white tracking-tight leading-tight font-serif">
            Admin Portal
          </h1>

          <p className="text-sm text-gray-400 leading-relaxed max-w-[300px]">
            Sign in to manage the platform, users, and system settings.
          </p>
        </header>

        {/* ── Card ───────────────────────────────────────────────────────── */}
        <div className="w-full bg-white/95 backdrop-blur-sm rounded-3xl px-8 py-9 flex flex-col gap-5 shadow-2xl">
          {/* Server error */}
          {serverError && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm"
              role="alert"
            >
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-7"
          >
            {/* Email */}
            <div className="flex flex-col gap-3">
              <label htmlFor="email" className="text-sm font-medium text-gray-900">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                className={`w-full bg-transparent border-0 border-b pb-1.5 text-[0.9375rem] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-b-[#0f173e] ${
                  errors.email ? "border-b-red-500" : "border-b-gray-300"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-0.5" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-3">
              <label htmlFor="password" className="text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full bg-transparent border-0 border-b pb-1.5 pr-8 text-[0.9375rem] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-b-[#0f173e] ${
                    errors.password ? "border-b-red-500" : "border-b-gray-300"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0f173e] transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.8} />
                  ) : (
                    <Eye size={18} strokeWidth={1.8} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-0.5" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#0f173e] cursor-pointer"
                  {...register("rememberMe")}
                />
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#0f173e] hover:bg-[#1a2456] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 text-base transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Signing in…
                </>
              ) : (
                "Access Admin Portal →"
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-sm text-gray-400">
          Not an admin?{" "}
          <a
            href="/auth/login"
            className="font-medium text-green-400 hover:text-green-300 hover:underline transition-colors"
          >
            Regular login
          </a>
        </p>

        {/* Legal footer */}
        <footer className="flex flex-col items-center gap-1.5 mt-2">
          <p className="text-[0.8125rem] text-gray-500">
            © {new Date().getFullYear()} Acadexis. Admin access only.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
    />
  );
}