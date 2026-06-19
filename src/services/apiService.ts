import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiClient, { publicApiClient, tokenStorage } from "./api-client";
import { AuthUser, UserProfile } from "@/types/user";
import { Course, CourseModule, PaginatedResponse, EnrolledStudent } from "@/types/course";
import { Notification } from "@/types/notification";
import type { CourseMaterial } from "@/types/material";
import { University, Faculty, Department } from "@/types/institution";
import type {
  StudySession,
  ChatMessage,
  AskResponse,
  SessionFeedbackPayload,
  Bookmark,
} from "@/types/studylab";
import { TopicStruggle } from "@/types/analytics";
import { ContactMessage, IssueReport } from "@/types/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Standardised shape every service method resolves to */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

// ─── Service ──────────────────────────────────────────────────────────────────

const apiService = {
  // ── Generic HTTP verbs ──────────────────────────────────────────────────────

  get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.get<T>(url, config);
  },

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.post<T>(url, data, config);
  },

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.put<T>(url, data, config);
  },

  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.patch<T>(url, data, config);
  },

  delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.delete<T>(url, config);
  },

  // ── Auth ────────────────────────────────────────────────────────────────────

  auth: {
    /** Email + password login */
    login(payload: LoginPayload): Promise<AxiosResponse<LoginResponse>> {
      return apiClient.post<LoginResponse>("/auth/login/", payload);
    },

    /** Register a new user */
    register(payload: Record<string, unknown>): Promise<AxiosResponse<{ success: boolean; user: AuthUser }>> {
      return apiClient.post<{ success: boolean; user: AuthUser }>("/auth/register/", payload);
    },

    /** Logout — invalidates refresh token on the server */
    async logout(): Promise<void> {
      const refreshToken = tokenStorage.getRefreshToken();

      try {
        if (refreshToken) {
          await apiClient.post<void>("/auth/logout/", { refresh: refreshToken });
        } else {
          await apiClient.post<void>("/auth/logout/", {});
        }
      } catch {
        // Ignore logout errors and proceed with client-side cleanup.
      } finally {
        tokenStorage.clearAll();
        window.location.href = "/auth/login";
      }
    },

    /** Get the Google OAuth redirect URL for university SSO */
    getGoogleAuthUrl(role?: string): Promise<AxiosResponse<{ url: string }>> {
      return apiClient.get<{ url: string }>("/auth/google/url/", {
        params: role ? { role } : undefined,
      });
    },

    /** Exchange Google OAuth code for tokens (called on the callback page) */
    googleCallback(code: string): Promise<AxiosResponse<LoginResponse>> {
      return apiClient.post<LoginResponse>("/auth/google/callback/", { code });
    },

    /** Refresh the access token using the stored refresh token */
    refreshToken(refresh: string): Promise<AxiosResponse<{ access: string; refresh: string }>> {
      return apiClient.post<{ access: string; refresh: string }>("/auth/token/refresh/", { refresh });
    },

    /** Request a password-reset email */
    forgotPassword(email: string): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.post<{ message: string }>("/auth/password/reset/", { email });
    },

    /** Verify user's email using 6-digit code */
    verifyEmail(email: string, code: string): Promise<AxiosResponse<{ success: boolean; message: string }>> {
      return publicApiClient.post<{ success: boolean; message: string }>("/auth/verify-email/", { email, code });
    },

    /** Resend 6-digit verification code */
    resendVerificationCode(email: string): Promise<AxiosResponse<{ success: boolean; message: string }>> {
      return publicApiClient.post<{ success: boolean; message: string }>("/auth/resend-verification/", { email });
    },

    /** Complete password reset with the token from the email */
    resetPassword(
      token: string,
      newPassword: string
    ): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.post<{ message: string }>("/auth/password/reset/confirm/", {
        token,
        new_password: newPassword,
        new_password_confirm: newPassword,
      });
    },
  },

  // ── User / Profile ──────────────────────────────────────────────────────────

  user: {
    /** Get the full authenticated user object */
    me(): Promise<AxiosResponse<AuthUser>> {
      return apiClient.get<AuthUser>("/users/me/");
    },

    /** Update email only */
    updateEmail(data: { email: string }): Promise<AxiosResponse<AuthUser>> {
      return apiClient.patch<AuthUser>("/users/me/", data);
    },

    profile: {
      get(): Promise<AxiosResponse<UserProfile>> {
        return apiClient.get<UserProfile>("/users/profile/");
      },

      update(data: {
        first_name?: string;
        last_name?: string;
        level?: string;
        department?: string | null;
        identification_number?: string;
        avatar?: File;
      }): Promise<AxiosResponse<UserProfile>> {
        if (data.avatar) {
          const formData = new FormData();
          if (data.first_name !== undefined) formData.append("first_name", data.first_name);
          if (data.last_name !== undefined) formData.append("last_name", data.last_name);
          if (data.level !== undefined) formData.append("level", data.level);
          if (data.department !== undefined && data.department !== null) formData.append("department", data.department);
          if (data.identification_number !== undefined) formData.append("identification_number", data.identification_number);
          formData.append("avatar", data.avatar);

          return apiClient.patch<UserProfile>("/users/profile/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        const { avatar: _avatar, ...jsonData } = data;
        return apiClient.patch<UserProfile>("/users/profile/", jsonData);
      },
    },

    /** Change password (requires current password) */
    changePassword(
      currentPassword: string,
      newPassword: string
    ): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.put<{ message: string }>("/auth/password/change/", {
        old_password: currentPassword,
        new_password: newPassword,
        new_password_confirm: newPassword,
      });
    },
  },

  // ── Courses ──────────────────────────────────────────────────────────────────

  courses: {
    /** Get paginated course list */
    getAll(params?: {
      page?: number;
      department?: string;
      lecturer?: string;
      level?: string;
      search?: string;
      ordering?: string;
    }): Promise<AxiosResponse<PaginatedResponse<Course>>> {
      return apiClient.get<PaginatedResponse<Course>>("/courses/", { params });
    },

    /** Get the authenticated user's courses */
    getMyCourses(): Promise<AxiosResponse<Course[]>> {
      return apiClient.get<Course[]>("/courses/mine/");
    },

    /** Get a specific course by ID */
    getById(courseId: string): Promise<AxiosResponse<Course>> {
      return apiClient.get<Course>(`/courses/${courseId}/`);
    },

    /** Enroll in a course */
    enroll(courseId: string): Promise<AxiosResponse<{ success: boolean; message: string }>> {
      return apiClient.post<{ success: boolean; message: string }>(`/courses/${courseId}/enroll/`);
    },

    /** Unenroll from a course */
    unenroll(courseId: string): Promise<AxiosResponse<{ success: boolean; message: string }>> {
      return apiClient.post<{ success: boolean; message: string }>(`/courses/${courseId}/unenroll/`);
    },

    /** Rate a course */
    rateCourse(courseId: string, score: number, reaction: "up" | "down"): Promise<AxiosResponse<{ success: boolean; message: string }>> {
      return apiClient.post<{ success: boolean; message: string }>(`/courses/${courseId}/rate/`, {
        score,
        reaction,
      });
    },

    /** Get students enrolled in a course */
    getStudents(courseId: string): Promise<AxiosResponse<EnrolledStudent[]>> {
      return apiClient.get<EnrolledStudent[]>(`/courses/${courseId}/students/`);
    },

    /** Create a new course */
    createCourse(data: {
      title: string;
      code: string;
      description: string;
      department: string;
      level: string;
      lecturer_remark?: string;
    }): Promise<AxiosResponse<Course>> {
      return apiClient.post<Course>("/courses/", data);
    },

    /** Get modules for a course */
    getModules(courseId: string): Promise<AxiosResponse<CourseModule[]>> {
      return apiClient.get<CourseModule[]>("/modules/", {
        params: { course: courseId },
      });
    },

    /** Get a specific module by ID */
    getModuleById(moduleId: string): Promise<AxiosResponse<CourseModule>> {
      return apiClient.get<CourseModule>(`/modules/${moduleId}/`);
    },

    /** Get recommendations for a course */
    getRecommendations(courseId: string): Promise<AxiosResponse<Course[]>> {
      return apiClient.get<Course[]>("/recommendations/", {
        params: { course: courseId },
      });
    },

    /** Get materials for a specific course */
    getMaterials(courseId: string): Promise<AxiosResponse<CourseMaterial[]>> {
      return apiClient.get<CourseMaterial[]>("/materials/", {
        params: { course: courseId },
      });
    },

    /** Upload a new course material file */
    uploadMaterial(courseId: string, file: File): Promise<AxiosResponse<CourseMaterial>> {
      const body = new FormData();
      body.append("course", courseId);
      body.append("file", file);
      return apiClient.post<CourseMaterial>("/materials/", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  },

  studyLab: {
    async getSessionsForCourse(courseId: string): Promise<StudySession[]> {
      const response = await apiClient.get<StudySession[]>("/sessions/", {
        params: { course: courseId },
      });
      return response.data;
    },

    async getAllSessions(): Promise<StudySession[]> {
      const response = await apiClient.get<StudySession[]>("/sessions/");
      return response.data;
    },

    async getSessionById(sessionId: string): Promise<StudySession> {
      const response = await apiClient.get<StudySession>(`/sessions/${sessionId}/`);
      return response.data;
    },

    async createSession(data: {
      course: string;
      title?: string;
      description?: string;
    }): Promise<StudySession> {
      const response = await apiClient.post<StudySession>("/sessions/", {
        course: data.course,
        title: data.title ?? "New Session",
        description: data.description ?? "",
      });
      return response.data;
    },

    async updateSession(sessionId: string, data: { title?: string; description?: string }): Promise<StudySession> {
      const response = await apiClient.patch<StudySession>(`/sessions/${sessionId}/`, data);
      return response.data;
    },

    async deleteSession(sessionId: string): Promise<void> {
      await apiClient.delete(`/sessions/${sessionId}/`);
    },

    async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
      const response = await apiClient.get<ChatMessage[]>(`/sessions/${sessionId}/messages/`);
      return response.data;
    },

    async askQuestion(sessionId: string, message: string): Promise<AskResponse> {
      const response = await apiClient.post<AskResponse>(`/sessions/${sessionId}/ask/`, {
        message,
      });
      return response.data;
    },

    async submitSessionFeedback(sessionId: string, payload: SessionFeedbackPayload): Promise<{ success: boolean }> {
      const response = await apiClient.post<{ success: boolean }>(`/sessions/${sessionId}/feedback/`, {
        rating: payload.rating,
        note: payload.note ?? "",
      });
      return response.data;
    },

    async getBookmarks(): Promise<Bookmark[]> {
      const response = await apiClient.get<Bookmark[]>("/bookmarks/");
      return response.data;
    },

    async createBookmark(data: {
      kind: "snippet" | "answer";
      title: string;
      content: string;
      material?: string;
      page?: number;
      message?: string;
    }): Promise<Bookmark> {
      const response = await apiClient.post<Bookmark>("/bookmarks/", data);
      return response.data;
    },

    async deleteBookmark(bookmarkId: string): Promise<void> {
      await apiClient.delete(`/bookmarks/${bookmarkId}/`);
    },
  },

  notifications: {
    getNotifications(params?: { page?: number; read?: boolean }): Promise<AxiosResponse<PaginatedResponse<Notification>>> {
      return apiClient.get<PaginatedResponse<Notification>>("/notifications/", { params });
    },

    getUnreadCount(): Promise<AxiosResponse<{ unread_count: number }>> {
      return apiClient.get<{ unread_count: number }>("/notifications/unread-count/");
    },

    markNotificationRead(notificationId: string): Promise<AxiosResponse<Notification>> {
      return apiClient.post<Notification>(`/notifications/${notificationId}/mark-as-read/`);
    },

    markAllNotificationsRead(): Promise<AxiosResponse<{ marked: number }>> {
      return apiClient.post<{ marked: number }>("/notifications/mark-all-read/");
    },
  },

  materials: {
    getCourseMaterials(courseId: string): Promise<AxiosResponse<PaginatedResponse<CourseMaterial>>> {
      return apiClient.get<PaginatedResponse<CourseMaterial>>("/materials/", {
        params: { course: courseId },
      });
    },

    getMaterialById(materialId: string): Promise<CourseMaterial> {
      return apiClient.get<CourseMaterial>(`/materials/${materialId}/`).then((response) => response.data);
    },

    uploadCourseMaterial(formData: FormData): Promise<AxiosResponse<CourseMaterial>> {
      return apiClient.post<CourseMaterial>("/materials/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    renameMaterial(materialId: string, data: { file_name: string }): Promise<AxiosResponse<CourseMaterial>> {
      return apiClient.patch<CourseMaterial>(`/materials/${materialId}/`, data);
    },

    deleteMaterial(materialId: string): Promise<AxiosResponse<void>> {
      return apiClient.delete<void>(`/materials/${materialId}/`);
    },
  },

  institutions: {
    getUniversities(params?: { page?: number; search?: string }): Promise<AxiosResponse<PaginatedResponse<University>>> {
      return publicApiClient.get<PaginatedResponse<University>>("/universities/", { params });
    },

    getUniversityById(id: string): Promise<AxiosResponse<University>> {
      return publicApiClient.get<University>(`/universities/${id}/`);
    },

    getFaculties(universityId: string): Promise<AxiosResponse<Faculty[]>> {
      return publicApiClient.get<Faculty[]>("/faculties/", {
        params: { university: universityId },
      });
    },

    getDepartments(params: { faculty?: string; university?: string }): Promise<AxiosResponse<Department[]>> {
      return publicApiClient.get<Department[]>("/departments/", { params });
    },
  },

  analytics: {
    getHeatmap(params?: {
      course?: string;
      ordering?: string;
      search?: string;
      page?: number;
    }): Promise<AxiosResponse<PaginatedResponse<TopicStruggle>>> {
      return apiClient.get<PaginatedResponse<TopicStruggle>>("/heatmap/", {
        params,
      });
    },
  },

  support: {
    contact(data: { subject: string; body: string; email: string }): Promise<AxiosResponse<ContactMessage>> {
      return apiClient.post<ContactMessage>("/support/contact/", data);
    },

    report(data: { title: string; description: string; severity: "low" | "medium" | "high" | "critical" }): Promise<AxiosResponse<IssueReport>> {
      return apiClient.post<IssueReport>("/support/report/", data);
    },
  },
};

export default apiService;