"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import apiService from "@/services/apiService";
import { tokenStorage } from "@/services/api-client";
import { mapBackendUser, useAppStore } from "@/store/useAppStore";
import { type Department, type Faculty, type University } from "@/types/institution";

const normalizeArrayResponse = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "results" in payload) {
    const results = (payload as { results?: unknown }).results;
    if (Array.isArray(results)) return results;
  }
  return [];
};

function RegisterCompleteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const code = searchParams.get("code") || "";
  const email = searchParams.get("email") || "";
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const role = searchParams.get("role") || "student";
  
  const isLecturer = role === "lecturer";

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const [universities, setUniversities] = useState<University[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [level, setLevel] = useState("");

  // Load universities
  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const response = await apiService.institutions.getUniversities();
        setUniversities(normalizeArrayResponse<University>(response.data));
      } catch (error) {
        console.error("Failed to load universities:", error);
        setServerError("Unable to load universities. Please refresh the page.");
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
        setSelectedFaculty("");
        setSelectedDepartment("");
      } catch (error) {
        console.error("Failed to load faculties:", error);
        setServerError("Unable to load faculties. Please try again.");
      }
    };
    void loadFaculties();
  }, [selectedUniversity]);

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
        setSelectedDepartment("");
      } catch (error) {
        console.error("Failed to load departments:", error);
        setServerError("Unable to load departments. Please try again.");
      }
    };
    void loadDepartments();
  }, [selectedFaculty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUniversity || !selectedDepartment) {
      setServerError("Please select your university and department.");
      return;
    }
    if (!isLecturer && (!identificationNumber || !level)) {
      setServerError("Matric number and level are required for students.");
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      // Complete registration with code and form details
      const response = await apiService.post("/auth/google/callback/", {
        code,
        role,
        university: selectedUniversity,
        faculty: selectedFaculty,
        department: selectedDepartment,
        identification_number: identificationNumber,
        level,
        first_name: firstName,
        last_name: lastName,
      });

      const { access, refresh, user } = response.data as any;
      tokenStorage.setToken(access);
      tokenStorage.setRefreshToken(refresh);

      // Save auth cookies
      document.cookie = `access_token=${access}; path=/; max-age=${60 * 60}; SameSite=Lax`;
      document.cookie = `refresh_token=${refresh}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;

      // Hydrate state
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

      const nextRoute = user.role === "lecturer" ? "/dashboard/lecturer" : "/dashboard/student";
      router.push(nextRoute);
    } catch (err: any) {
      console.error("Failed to complete Google registration:", err);
      setServerError(err.response?.data?.detail || "Registration failed. Please check your inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-8 shadow-xl flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#0f173e] tracking-tight font-serif">
          Complete Your Registration
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Provide your academic profile details for <span className="font-semibold">{email}</span>
        </p>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-xs">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* University */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-700 tracking-wider">
            UNIVERSITY
          </label>
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-400"
          >
            <option value="" disabled>Select your university</option>
            {universities.map((uni) => (
              <option key={uni.id} value={uni.id}>{uni.name}</option>
            ))}
          </select>
        </div>

        {/* Faculty */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-700 tracking-wider">
            FACULTY
          </label>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            required
            disabled={!selectedUniversity}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-400 disabled:opacity-50"
          >
            <option value="">Select your faculty</option>
            {faculties.map((fac) => (
              <option key={fac.id} value={fac.id}>{fac.name}</option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-700 tracking-wider">
            DEPARTMENT
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            required
            disabled={!selectedFaculty}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-400 disabled:opacity-50"
          >
            <option value="">Select your department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        {/* Matric Number (Students Only) */}
        {!isLecturer && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-700 tracking-wider">
              MATRIC NUMBER
            </label>
            <input
              type="text"
              required
              value={identificationNumber}
              onChange={(e) => setIdentificationNumber(e.target.value)}
              placeholder="e.g. U2018/5570024"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
            />
          </div>
        )}

        {/* Level (Students Only) */}
        {!isLecturer && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-700 tracking-wider">
              LEVEL
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-400"
            >
              <option value="" disabled>Select your level</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
              <option value="500">500 Level</option>
            </select>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0f173e] hover:bg-[#1a2456] disabled:opacity-75 text-white font-medium rounded-lg py-3 text-sm mt-2 transition-colors flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-transparent border-t-white animate-spin" />
              Completing setup...
            </>
          ) : (
            "Complete Registration →"
          )}
        </button>
      </form>
    </div>
  );
}

export default function RegisterCompletePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#eef2f0] px-4 py-8">
      <div className="w-full max-w-[480px] flex flex-col items-center gap-6">
        <header className="flex flex-col items-center gap-2">
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
            <p className="text-sm font-medium text-gray-700">Loading form...</p>
          </div>
        }>
          <RegisterCompleteForm />
        </Suspense>
      </div>
    </main>
  );
}
