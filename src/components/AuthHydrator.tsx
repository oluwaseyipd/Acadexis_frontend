"use client";

import { useEffect } from "react";
import { tokenStorage } from "@/services/api-client";
import { mapBackendUser, useAppStore } from "@/store/useAppStore";

type JwtPayload = {
  user_id?: string;
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
  university?: string;
  university_id?: string;
  university_name?: string;
  first_name?: string;
  last_name?: string;
  identification_number?: string;
  level?: string;
  department?: string;
  department_name?: string;
  faculty?: string;
  faculty_name?: string;
  avatar?: string;
  avatar_url?: string;
};

const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, "="));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
};

export default function AuthHydrator() {
  useEffect(() => {
    const token = tokenStorage.getToken();
    if (!token) return;

    const payload = decodeJwt(token);
    if (!payload || !payload.exp || payload.exp * 1000 < Date.now()) {
      tokenStorage.clearAll();
      return;
    }

    const userId = payload.user_id ?? payload.sub;
    if (!userId || !payload.email || !payload.role) return;

    useAppStore.getState().setUser(
      mapBackendUser({
        id: userId,
        email: payload.email,
        role: payload.role as any,
        university: payload.university ?? payload.university_id ?? "",
        university_name: payload.university_name ?? null,
        name: `${payload.first_name ?? ""} ${payload.last_name ?? ""}`.trim(),
        profile: {
          first_name: payload.first_name ?? "",
          last_name: payload.last_name ?? "",
          identification_number: payload.identification_number ?? "",
          level: payload.level ?? "",
          department: payload.department ?? null,
          department_name: payload.department_name ?? null,
          faculty: payload.faculty ?? null,
          faculty_name: payload.faculty_name ?? null,
          avatar: payload.avatar ?? null,
          avatar_url: payload.avatar_url ?? payload.avatar ?? null,
        },
      })
    );
  }, []);

  return null;
}
