import { create } from "zustand";
import { AuthUser, AuthUserMapped, UserRole } from "@/types/user";

export const mapBackendUser = (raw: AuthUser): AuthUserMapped => {
  const profileData = raw.profile as Record<string, unknown>;
  
  return {
    ...raw,
    profile: {
      ...raw.profile,
      // Handle both snake_case and camelCase from backend
      first_name: (profileData.first_name ?? profileData.firstName) as string,
      last_name: (profileData.last_name ?? profileData.lastName) as string,
      identification_number: (profileData.identification_number ?? profileData.identificationNumber) as string,
      firstName: (profileData.first_name ?? profileData.firstName) as string,
      lastName: (profileData.last_name ?? profileData.lastName) as string,
      identificationNumber: (profileData.identification_number ?? profileData.identificationNumber) as string,
      level: raw.profile.level,
      department: raw.profile.department,
      faculty: raw.profile.faculty ?? null,
      university: raw.university,
      avatarUrl: raw.profile.avatar ?? raw.profile.avatar_url,
      avatar_url: raw.profile.avatar_url ?? raw.profile.avatar,
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
