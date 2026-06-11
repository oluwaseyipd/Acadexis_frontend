"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import apiService from "@/services/apiService";
import { tokenStorage } from "@/services/api-client";
import { mapBackendUser, useAppStore } from "@/store/useAppStore";

function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // Parse role from state if it exists
    let role = "";
    if (state) {
      try {
        const parsedState = Object.fromEntries(new URLSearchParams(state));
        if (parsedState.role) {
          role = parsedState.role;
        }
      } catch (e) {
        console.error("Failed to parse state parameters:", e);
      }
    }

    if (!code) {
      setError("No authorization code provided by Google.");
      return;
    }

    const exchangeCode = async () => {
      try {
        // Exchange code for tokens
        const response = await apiService.auth.googleCallback(code);
        const data = response.data as any;

        if (data.registered === false) {
          // User exists but has not completed signup details (uni, dept, etc.)
          // Redirect them to complete register page
          const queryParams = new URLSearchParams({
            code,
            email: data.email || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            role: role || "student",
          });
          router.push(`/auth/register/complete?${queryParams.toString()}`);
        } else {
          // User successfully authenticated. Save JWT tokens
          const { access, refresh, user } = data;
          tokenStorage.setToken(access);
          tokenStorage.setRefreshToken(refresh);

          // Save auth cookies
          document.cookie = `access_token=${access}; path=/; max-age=${60 * 60}; SameSite=Lax`;
          document.cookie = `refresh_token=${refresh}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;

          // Hydrate user state in Zustand store
          const rawUser = user;
          const rawProfile = user.profile || {};
          const looseProfile = rawProfile as unknown as Record<string, unknown>;
          const looseUser = rawUser as unknown as Record<string, unknown>;

          useAppStore.getState().setUser(
            mapBackendUser({
              ...rawUser,
              profile: {
                ...rawProfile,
                first_name: (looseProfile.firstName as string | undefined) ?? rawProfile.first_name ?? "",
                last_name: (looseProfile.lastName as string | undefined) ?? rawProfile.last_name ?? "",
                identification_number: (looseProfile.identificationNumber as string | undefined) ?? rawProfile.identification_number ?? "",
                level: rawProfile.level ?? "",
                department: rawProfile.department ?? null,
                department_name: (looseProfile.departmentName as string | undefined) ?? rawProfile.department_name ?? null,
                faculty: rawProfile.faculty ?? null,
                faculty_name: (looseProfile.facultyName as string | undefined) ?? rawProfile.faculty_name ?? null,
                university: rawUser.university ?? (looseProfile.university as string | undefined) ?? null,
                university_name: (looseUser.universityName as string | undefined) ?? rawUser.university_name ?? (looseProfile.universityName as string | undefined) ?? rawProfile.university_name ?? null,
                avatar: rawProfile.avatar ?? null,
                avatar_url: (looseProfile.avatarUrl as string | undefined) ?? rawProfile.avatar_url ?? rawProfile.avatar ?? null,
              },
            })
          );

          // Redirect to appropriate dashboard based on user role
          const nextRoute = user.role === "lecturer" ? "/dashboard/lecturer" : "/dashboard/student";
          router.push(nextRoute);
        }
      } catch (err: any) {
        console.error("Google authentication callback failed:", err);
        const backendMessage = err.response?.data?.detail || err.response?.data?.message;
        setError(backendMessage || "Authentication with Google failed. Please use your official university account.");
      }
    };

    void exchangeCode();
  }, [router, searchParams]);

  return (
    <div className="w-full bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center gap-4">
      {error ? (
        <>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
            ⚠️
          </div>
          <p className="text-sm font-medium text-red-600 leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-4 px-6 py-2.5 bg-[#0f173e] hover:bg-[#1a2456] text-white rounded-lg text-sm font-medium transition-colors"
          >
            Back to Login
          </button>
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-full border-3 border-green-500/20 border-t-green-500 animate-spin mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Verifying academic credentials...
          </p>
          <p className="text-xs text-gray-400">
            Securing your connection to the digital athenaeum
          </p>
        </>
      )}
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#eef2f0] px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center text-center gap-6">
        <header className="flex flex-col items-center gap-3">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-[#0f173e] flex items-center justify-center text-green-500">
            <GraduationCap size={24} strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-bold text-[#0f173e] tracking-tight leading-tight font-serif">
            Acadexis
          </h1>
        </header>

        <Suspense fallback={
          <div className="w-full bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-3 border-green-500/20 border-t-green-500 animate-spin mb-2" />
            <p className="text-sm font-medium text-gray-700">Loading callback handler...</p>
          </div>
        }>
          <GoogleCallbackHandler />
        </Suspense>
      </div>
    </main>
  );
}
