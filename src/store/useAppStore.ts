import { create } from "zustand";
import { AuthUser, AuthUserMapped } from "@/types/user";

export type UserRole = "student" | "lecturer" | "admin";

export const mapBackendUser = (raw: AuthUser): AuthUserMapped => ({
  ...raw,
  profile: {
    ...raw.profile,
    firstName: raw.profile.first_name,
    lastName: raw.profile.last_name,
    identificationNumber: raw.profile.identification_number,
    level: raw.profile.level,
    departmentId: raw.profile.department,
    universityId: raw.university,
    avatarUrl: raw.profile.avatar ?? raw.profile.avatar_url,
    avatar_url: raw.profile.avatar_url ?? raw.profile.avatar,
  },
});

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
