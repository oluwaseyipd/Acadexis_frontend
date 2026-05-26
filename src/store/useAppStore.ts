import { create } from "zustand";

export type UserRole = "student" | "lecturer" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  universityId: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  identificationNumber: string;
  level: string;
  departmentId: string;
  avatarUrl?: string;
}

interface AppState {
  user: (User & Profile) | null;
  isAuthenticated: boolean;
  sidebarOpen: boolean;
  notificationsOpen: boolean;
  searchQuery: string;
  setUser: (user: (User & Profile) | null) => void;
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
  sidebarOpen: true,
  notificationsOpen: false,
  searchQuery: "",
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleNotifications: () => set((s) => ({ notificationsOpen: !s.notificationsOpen })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
