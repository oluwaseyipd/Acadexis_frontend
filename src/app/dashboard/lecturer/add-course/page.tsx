"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import apiService from "@/services/apiService";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAppStore } from "@/store/useAppStore";

// ─── Validation Schema ────────────────────────────────────────────────────────
const courseSchema = z.object({
  title: z
    .string()
    .min(1, "Course title is required")
    .min(3, "Course title must be at least 3 characters")
    .max(200, "Course title must not exceed 200 characters"),

  code: z
    .string()
    .min(1, "Course code is required")
    .min(2, "Course code must be at least 2 characters")
    .max(20, "Course code must not exceed 20 characters")
    .regex(/^[A-Z0-9]+$/i, "Course code can only contain letters and numbers"),

  description: z
    .string()
    .min(1, "Description is required")
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must not exceed 1000 characters"),

  level: z.string().min(1, "Level is required"),

  lecturer_remark: z.string().max(500, "Remark must not exceed 500 characters").optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

// ─── Field wrapper component ────────────────────────────────────────────────
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

// ─── Input styling helper ──────────────────────────────────────────────────
const inputCn = (hasError: boolean) =>
  `w-full px-4 py-3 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-1 ${
    hasError
      ? "border-red-300 bg-red-50 focus:ring-red-400"
      : "border-gray-200 bg-white focus:ring-green-400 focus:border-green-400"
  }`;

// ─── Spinner component ──────────────────────────────────────────────────────
const Spinner = ({ light = false }: { light?: boolean }) => (
  <div
    className={`w-4 h-4 rounded-full border-2 border-transparent ${
      light ? "border-t-white" : "border-t-gray-700"
    } animate-spin`}
  />
);

// ─── Component ──────────────────────────────────────────────────────────────
export default function AddCoursePage() {
  const router = useRouter();
  const { isLoading: userLoading } = useCurrentUser();
  const { user: storeUser } = useAppStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get department from user profile
  const departmentId = storeUser?.profile?.department;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: CourseFormData) => {
    if (!departmentId) {
      setServerError("Your department is not set. Please complete your profile first.");
      return;
    }

    setIsSubmitting(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      await apiService.courses.createCourse({
        title: data.title,
        code: data.code.toUpperCase(),
        description: data.description,
        department: departmentId,
        level: data.level,
        lecturer_remark: data.lecturer_remark,
      });

      setSuccessMessage("Course created successfully! Redirecting to your courses...");

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/lecturer/my-courses");
      }, 1500);
    } catch (err: unknown) {
      let message = "Failed to create course. Please try again.";
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as { response?: { data?: Record<string, unknown> } }).response;
        if (response?.data) {
          const data = response.data;
          // Check for specific field errors
          if (typeof data === "object") {
            const firstError = Object.values(data).flat().find(Boolean);
            if (typeof firstError === "string") {
              message = firstError;
            }
          }
        }
      }
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking user
  if (userLoading) {
    return (
      <div className="max-w-[1500px] mx-auto px-8 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if user has a department
  if (!departmentId && !userLoading) {
    return (
      <div className="max-w-[1500px] mx-auto px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Complete Your Profile</h2>
          <p className="text-gray-500 mb-6">
            You need to set up your department in your profile before creating courses.
          </p>
          <Link
            href="/dashboard/lecturer/profile"
            className="inline-flex items-center gap-2 bg-[#0f173e] hover:bg-[#1a2456] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/lecturer/my-courses"
            className="h-10 w-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create New Course</h1>
            <p className="text-muted-foreground">Add a new course to your teaching portfolio</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_32px_rgba(15,23,62,0.08)] overflow-hidden max-w-2xl">
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

            {/* Success message */}
            {successMessage && (
              <div
                className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm"
                role="alert"
              >
                {successMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-5"
            >
              {/* Course Title */}
              <Field label="COURSE TITLE" error={errors.title?.message}>
                <input
                  type="text"
                  placeholder="e.g., Advanced Physics"
                  autoComplete="off"
                  className={inputCn(!!errors.title)}
                  {...register("title")}
                />
              </Field>

              {/* Course Code */}
              <Field label="COURSE CODE" error={errors.code?.message}>
                <input
                  type="text"
                  placeholder="e.g., PHY401"
                  autoComplete="off"
                  className={inputCn(!!errors.code)}
                  {...register("code")}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the official course code (e.g., PHY401, CSC302)
                </p>
              </Field>

              {/* Level */}
              <Field label="LEVEL" error={errors.level?.message}>
                <select
                  className={`${inputCn(!!errors.level)} text-gray-700 bg-white cursor-pointer`}
                  defaultValue=""
                  {...register("level")}
                >
                  <option value="" disabled>
                    Select level
                  </option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                  <option value="PG">Postgraduate</option>
                </select>
              </Field>

              {/* Description */}
              <Field label="DESCRIPTION" error={errors.description?.message}>
                <textarea
                  placeholder="Describe what students will learn in this course..."
                  rows={4}
                  className={`${inputCn(!!errors.description)} resize-none`}
                  {...register("description")}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {typeof errors.description?.message === "undefined"
                    ? "Minimum 20 characters"
                    : `${errors.description.message}`}
                </p>
              </Field>

              {/* Lecturer Remark */}
              <Field label="LECTURER REMARK (OPTIONAL)" error={errors.lecturer_remark?.message}>
                <textarea
                  placeholder="Any additional notes for students..."
                  rows={2}
                  className={`${inputCn(!!errors.lecturer_remark)} resize-none`}
                  {...register("lecturer_remark")}
                />
              </Field>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#0f173e] hover:bg-[#1a2456] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 text-base transition-all duration-200 mt-1"
              >
                {isSubmitting ? (
                  <>
                    <Spinner light />
                    Creating course...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-5 w-5" />
                    Create Course
                  </>
                )}
              </button>

              {/* Cancel Link */}
              <div className="text-center">
                <Link
                  href="/dashboard/lecturer/my-courses"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel and go back
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 max-w-2xl">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Tips for creating a great course</h3>
        <ul className="text-sm text-blue-700 space-y-1.5">
          <li>• Use a clear, descriptive course title that students can easily find</li>
          <li>• Make sure the course code matches your institution&apos;s official listing</li>
          <li>• Write a detailed description to help students understand the course content</li>
          <li>• Add a remark with any prerequisites or specific requirements</li>
        </ul>
      </div>
    </div>
  );
}