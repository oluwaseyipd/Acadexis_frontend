"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import apiService from "@/services/apiService";
import { useRouter } from "next/navigation";
import { type Department, type Faculty, type University } from "@/types/institution";

// ─── Types ────────────────────────────────────────────────────────────────────
export type UserRole = "lecturer" | "student";

// ─── Validation Schema ────────────────────────────────────────────────────────
const baseSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "First name contains invalid characters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Last name contains invalid characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine(
      (val) => {
        const domain = val.split("@")[1]?.toLowerCase() || "";
        const isFreeEmail = /^(gmail|yahoo|outlook|hotmail|aol|protonmail|icloud)\.(com|co\.|net|org)$/.test(
          domain
        );
        if (isFreeEmail) return false;

        const academicPatterns =
          /\.(edu|ac\.|edu\.[a-z]{2}|co\.[a-z]{2}|org\.[a-z]{2})$/i;
        const hasAcademicIndicators = /student|staff|faculty|lecturer|prof|alumni/i.test(
          val
        );

        return academicPatterns.test(domain) || hasAcademicIndicators;
      },
      { message: "Please use your institution email address" }
    ),

  university: z.string().min(1, "University is required"),
  faculty: z.string().min(1, "Faculty is required"),
  department: z.string().min(1, "Department is required"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),

  confirmPassword: z.string().min(1, "Please confirm your password"),
  identificationNumber: z.string().optional(),
  level: z.string().optional(),
});

const registerSchema = baseSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface RegisterFormProps {
  role: UserRole;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Normalize API responses that might be paginated
const normalizeArrayResponse = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "results" in payload) {
    const results = (payload as { results?: unknown }).results;
    if (Array.isArray(results)) return results;
  }
  return [];
};

// Password strength calculation
const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  return {
    score: Math.min(score, 4),
    label: labels[Math.min(score, 3)],
    color: colors[Math.min(score, 3)],
  };
};

// Field wrapper component
const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-700 tracking-wider">
      {label}
    </label>
    <div>{children}</div>
    {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
  </div>
);

// Input styling helper
const inputCn = (hasError: boolean) =>
  `w-full px-4 py-3 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-1 ${
    hasError
      ? "border-red-300 bg-red-50 focus:ring-red-400"
      : "border-gray-200 bg-white focus:ring-green-400 focus:border-green-400"
  }`;

// Eye toggle component
const EyeToggle = ({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
  >
    {show ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
);

// Google Icon component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// Spinner component
const Spinner = ({ light = false }) => (
  <div
    className={`w-4 h-4 rounded-full border-2 border-transparent ${
      light ? "border-t-white" : "border-t-gray-700"
    } animate-spin`}
  />
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function RegisterForm({ role }: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const isLecturer = role === "lecturer";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedUniversity = watch("university");
  const selectedFaculty = watch("faculty");

  // Load universities on mount
  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const response = await apiService.institutions.getUniversities();
        setUniversities(normalizeArrayResponse<University>(response.data));
      } catch (error) {
        console.error("Failed to load universities:", error);
        setServerError(
          "Unable to load universities right now. Please refresh the page or try again later."
        );
        setUniversities([]);
      }
    };

    void loadUniversities();
  }, []);

  // Load faculties when university changes
  useEffect(() => {
    if (!selectedUniversity) {
      setFaculties([]);
      setDepartments([]);
      return;
    }

    const loadFaculties = async () => {
      try {
        const response = await apiService.institutions.getFaculties(selectedUniversity);
        setFaculties(normalizeArrayResponse<Faculty>(response.data));
        setDepartments([]);
        setValue("faculty", "");
        setValue("department", "");
      } catch (error) {
        console.error("Failed to load faculties:", error);
        setServerError(
          "Unable to load faculties right now. Please refresh the page or try again later."
        );
        setFaculties([]);
        setDepartments([]);
      }
    };

    void loadFaculties();
  }, [selectedUniversity, setValue]);

  // Load departments when faculty changes
  useEffect(() => {
    if (!selectedFaculty) {
      setDepartments([]);
      return;
    }

    const loadDepartments = async () => {
      try {
        const response = await apiService.institutions.getDepartments({ faculty: selectedFaculty });
        setDepartments(normalizeArrayResponse<Department>(response.data));
        setValue("department", "");
      } catch (error) {
        console.error("Failed to load departments:", error);
        setServerError(
          "Unable to load departments right now. Please refresh the page or try again later."
        );
        setDepartments([]);
      }
    };

    void loadDepartments();
  }, [selectedFaculty, setValue]);

  // Password strength indicator
  const passwordValue = watch("password", "");
  const strength = getPasswordStrength(passwordValue);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const payload: Record<string, unknown> = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        role,
        university: data.university,
        faculty: data.faculty,
        department: data.department,
      };

      if (!isLecturer) {
        payload.identification_number = data.identificationNumber;
        payload.level = data.level;
      }

      await apiService.auth.register(payload);
      router.push("/auth/login");
    } catch (error: unknown) {
      let message = "Registration failed. Please try again.";
      if (typeof error === "object" && error !== null) {
        const err = error as Record<string, unknown>;
        if (err.response && typeof err.response === "object") {
          const response = err.response as Record<string, unknown>;
          if (response.data && typeof response.data === "object") {
            const responseData = response.data as Record<string, unknown>;
            if (typeof responseData.message === "string") {
              message = responseData.message;
            }
          }
        }
      }
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google SSO ──────────────────────────────────────────────────────────────
  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    setServerError(null);

    try {
      const response = await apiService.auth.getGoogleAuthUrl();
      if (response.data?.url) {
        window.location.href = `${response.data.url}&role=${role}`;
      }
    } catch {
      setServerError("Failed to initiate Google sign-up. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#eef2f0] px-4 py-8">
      {/* Top nav */}
      <nav className="flex justify-center mb-8">
        <a
          href="/register"
          className="text-sm font-medium text-[#0f173e] tracking-wide hover:text-green-600 transition-colors"
        >
          The Academic Curator
        </a>
      </nav>

      <div className="w-full max-w-[620px] mx-auto flex flex-col gap-6">
        {/* Header */}
        <header className="text-center flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0f173e] tracking-tight leading-tight font-serif">
            {isLecturer
              ? "Empower your students with AI-assisted learning"
              : "Start your AI-powered learning journey"}
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            {isLecturer
              ? "Join the next generation of academic innovators. Create your lecturer account to get started."
              : "Access course materials, chat with AI tutors, and track your academic progress."}
          </p>
        </header>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_32px_rgba(15,23,62,0.08)] overflow-hidden">
          {/* Green left accent */}
          <div className="flex">
            <div className="w-1.5 bg-green-400 flex-shrink-0" />

            <div className="flex-1 px-8 py-8 flex flex-col gap-5">
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
                className="flex flex-col gap-5"
              >
                {/* First Name */}
                <Field label="FIRST NAME" error={errors.firstName?.message}>
                  <input
                    type="text"
                    placeholder="Jane"
                    autoComplete="given-name"
                    className={inputCn(!!errors.firstName)}
                    {...register("firstName")}
                  />
                </Field>

                {/* Last Name */}
                <Field label="LAST NAME" error={errors.lastName?.message}>
                  <input
                    type="text"
                    placeholder="Doe"
                    autoComplete="family-name"
                    className={inputCn(!!errors.lastName)}
                    {...register("lastName")}
                  />
                </Field>

                {/* Email */}
                <Field label="UNIVERSITY EMAIL" error={errors.email?.message}>
                  <input
                    type="email"
                    placeholder="professor@university.edu"
                    autoComplete="email"
                    className={inputCn(!!errors.email)}
                    {...register("email")}
                  />
                </Field>

                {/* University */}
                <Field label="UNIVERSITY" error={errors.university?.message}>
                  <select
                    className={`${inputCn(!!errors.university)} text-gray-700 bg-white cursor-pointer`}
                    defaultValue=""
                    {...register("university")}
                  >
                    <option value="" disabled>
                      Select your university
                    </option>
                    {universities.map((university) => (
                      <option key={university.id} value={university.id}>
                        {university.name}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Faculty */}
                <Field label="FACULTY" error={errors.faculty?.message}>
                  <select
                    className={`${inputCn(!!errors.faculty)} text-gray-700 bg-white cursor-pointer`}
                    defaultValue=""
                    disabled={!selectedUniversity}
                    {...register("faculty")}
                  >
                    <option value="" disabled>
                      Select your faculty
                    </option>
                    {faculties.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Department */}
                <Field label="DEPARTMENT" error={errors.department?.message}>
                  <select
                    className={`${inputCn(!!errors.department)} text-gray-700 bg-white cursor-pointer`}
                    defaultValue=""
                    disabled={!selectedFaculty}
                    {...register("department")}
                  >
                    <option value="" disabled>
                      Select your department
                    </option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Identification Number (Student Only) */}
                {!isLecturer && (
                  <Field
                    label="IDENTIFICATION NUMBER"
                    error={errors.identificationNumber?.message}
                  >
                    <input
                      type="text"
                      placeholder="Enter your ID number"
                      autoComplete="off"
                      className={inputCn(!!errors.identificationNumber)}
                      {...register("identificationNumber")}
                    />
                  </Field>
                )}

                {/* Level (Student Only) */}
                {!isLecturer && (
                  <Field label="LEVEL" error={errors.level?.message}>
                    <select
                      className={`${inputCn(!!errors.level)} text-gray-700 bg-white cursor-pointer`}
                      defaultValue=""
                      {...register("level")}
                    >
                      <option value="" disabled>
                        Select your level
                      </option>
                      <option value="100">100 Level</option>
                      <option value="200">200 Level</option>
                      <option value="300">300 Level</option>
                      <option value="400">400 Level</option>
                      <option value="500">500 Level</option>
                    </select>
                  </Field>
                )}

                {/* Password */}
                <Field label="PASSWORD" error={errors.password?.message}>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`${inputCn(!!errors.password)} pr-8`}
                      {...register("password")}
                    />
                    <EyeToggle
                      show={showPassword}
                      onToggle={() => setShowPassword((v) => !v)}
                    />
                  </div>
                  {/* Strength meter */}
                  {passwordValue.length > 0 && (
                    <div className="mt-2 flex gap-1.5 items-center">
                      {[1, 2, 3, 4].map((i) => (
                        <span
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            i <= strength.score
                              ? strength.color
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-1 min-w-[50px]">
                        {strength.label}
                      </span>
                    </div>
                  )}
                </Field>

                {/* Confirm Password */}
                <Field
                  label="CONFIRM PASSWORD"
                  error={errors.confirmPassword?.message}
                >
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`${inputCn(!!errors.confirmPassword)} pr-8`}
                      {...register("confirmPassword")}
                    />
                    <EyeToggle
                      show={showConfirm}
                      onToggle={() => setShowConfirm((v) => !v)}
                    />
                  </div>
                </Field>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#0f173e] hover:bg-[#1a2456] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 text-base transition-all duration-200 mt-1"
                >
                  {isLoading ? (
                    <>
                      <Spinner light />
                      Creating account…
                    </>
                  ) : isLecturer ? (
                    "Create my lecturer workspace →"
                  ) : (
                    "Create my student account →"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 text-xs text-gray-400 tracking-widest uppercase">
                <span className="flex-1 h-px bg-gray-200" />
                OR
                <span className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google SSO */}
              <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 disabled:opacity-70 disabled:cursor-not-allowed text-gray-700 font-medium rounded-xl py-3.5 text-[0.9375rem] transition-all duration-200"
              >
                {isGoogleLoading ? (
                  <>
                    <Spinner />
                    Redirecting…
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    Continue with Google (University account)
                  </>
                )}
              </button>

              {/* Footer note */}
              <p className="text-sm text-gray-500 text-center">
                Already have a lecturer account?{" "}
                <a
                  href="/login"
                  className="font-medium text-green-600 hover:text-green-700 hover:underline transition-colors"
                >
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: "🛡", label: "ACADEMIC VERIFIED" },
            { icon: "🔒", label: "FERPA COMPLIANT" },
            { icon: "🌐", label: "GLOBAL STANDARDS" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-sm text-gray-400">{icon}</span>
              <span className="text-[0.7rem] font-semibold text-gray-400 tracking-wider">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Legal */}
        <p className="text-center text-[0.8125rem] text-gray-400 pb-4">
          © 2024 The Academic Curator. All rights reserved.
        </p>
      </div>
    </main>
  );
}
