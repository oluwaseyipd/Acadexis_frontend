import { create } from "zustand";
import { AuthUser, AuthUserMapped, UserRole } from "@/types/user";

export const mapBackendUser = (raw: AuthUser): AuthUserMapped => {
  const profile = raw.profile || {};
  const looseProfile = profile as unknown as Record<string, unknown>;
  const looseRaw = raw as unknown as Record<string, unknown>;

  return {
    ...raw,
    profile: {
      ...profile,
      firstName: (looseProfile.firstName as string | undefined) ?? profile.first_name ?? "",
      lastName: (looseProfile.lastName as string | undefined) ?? profile.last_name ?? "",
      email: raw.email ?? (looseProfile.email as string | undefined) ?? "",
      identificationNumber: (looseProfile.identificationNumber as string | undefined) ?? profile.identification_number ?? "",
      level: profile.level ?? "",
      department: profile.department ?? null,
      departmentName: (looseProfile.departmentName as string | undefined) ?? profile.department_name ?? null,
      faculty: profile.faculty ?? null,
      facultyName: (looseProfile.facultyName as string | undefined) ?? profile.faculty_name ?? null,
      university: raw.university ?? (looseProfile.university as string | undefined) ?? null,
      universityName: (looseRaw.universityName as string | undefined) ?? raw.university_name ?? (looseProfile.universityName as string | undefined) ?? profile.university_name ?? null,
      avatarUrl: (looseProfile.avatarUrl as string | undefined) ?? profile.avatar ?? profile.avatar_url ?? null,
      avatar_url: (looseProfile.avatarUrl as string | undefined) ?? profile.avatar_url ?? profile.avatar ?? null,
    },
  };
};

interface AppState {
  user: AuthUserMapped | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sidebarOpen: boolean;
  notificationsOpen: boolean;
  searchQuery: string;
  setUser: (user: AuthUserMapped | null) => void;
  clearUser: () => void;
  updateProfile: (profileUpdate: Partial<AuthUser["profile"]>) => void;
  updateEmail: (email: string) => void;
  setAuthenticated: (val: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (val: boolean) => void;
  toggleNotifications: () => void;
  setSearchQuery: (q: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  sidebarOpen: true,
  notificationsOpen: false,
  searchQuery: "",
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false }),
  updateProfile: (profileUpdate) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            profile: { ...state.user.profile, ...profileUpdate },
          }
        : null,
    })),
  updateEmail: (email) =>
    set((state) => ({
      user: state.user ? { ...state.user, email } : null,
    })),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleNotifications: () => set((s) => ({ notificationsOpen: !s.notificationsOpen })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));
