import axios from "axios";
import { tokenStorage } from "./api-client";
import type {
  AdminUser,
  AdminCourse,
  AdminStatistics,
  ContactMessage,
  IssueReport,
  AdminRequest,
  UserFilters,
  CourseFilters,
  CourseEnrollment,
  PaginatedAdminUsers,
  PaginatedAdminCourses,
  AnalyticsOverview,
} from "@/types/admin";

// ─── Admin API Client ─────────────────────────────────────────────────────────
// Use a separate axios instance that points directly to /admin (NOT /api/admin)
const ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://acadexis-backend.onrender.com";

// Separate client just for admin authentication (no /api prefix)
const adminAuthClient = axios.create({
  baseURL: `${ADMIN_BASE_URL}`,
  timeout: 30_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const adminApiClient = axios.create({
  baseURL: `${ADMIN_BASE_URL}/admin`,
  timeout: 30_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add auth interceptor for admin requests
adminApiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = tokenStorage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to camelize response keys (snake_case -> camelCase)
const camelizeKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(camelizeKeys);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc: Record<string, unknown>, [key, value]) => {
      const camelKey = key.replace(/([-_][a-z])/gi, (match) => match.toUpperCase().replace(/[-_]/g, ""));
      acc[camelKey] = camelizeKeys(value);
      return acc;
    }, {});
  }
  return obj;
};

adminApiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object") {
      response.data = camelizeKeys(response.data);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// ─── Admin Service ─────────────────────────────────────────────────────────────

const adminService = {
  // ── Authentication ──────────────────────────────────────────────────────────

  /**
   * Admin login - goes directly to /admin/login (not /api/auth/login)
   * This endpoint accepts any valid email (no university email required)
   * Body: { "email": string, "password": string } (rememberMe is not sent)
   */
  async login(payload: { email: string; password: string; rememberMe?: boolean }): Promise<{
    access: string;
    refresh: string;
    user: { id: string; email: string; role: string; name: string; profile: any };
  }> {
    const response = await adminAuthClient.post<{
      access: string;
      refresh: string;
      user: any;
    }>("/admin/login/", {
      email: payload.email,
      password: payload.password,
    });
    return response.data;
  },

  /**
   * Admin logout - goes directly to /admin/logout
   */
  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await adminAuthClient.post("/admin/logout/", { refresh: refreshToken });
      } else {
        await adminAuthClient.post("/admin/logout/", {});
      }
    } finally {
      tokenStorage.clearAll();
    }
  },

  // ── Statistics ───────────────────────────────────────────────────────────────

  /**
   * Get dashboard statistics
   * GET /admin/statistics/
   */
  async getStatistics(): Promise<AdminStatistics> {
    const response = await adminApiClient.get<AdminStatistics>("/statistics/");
    return response.data;
  },

  /**
   * Get analytics overview
   * GET /admin/analytics/overview/
   */
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const response = await adminApiClient.get<AnalyticsOverview>("/analytics/overview/");
    return response.data;
  },

  // ── User Management ─────────────────────────────────────────────────────────

  /**
   * List all users with filters
   * GET /admin/users/
   */
  async getUsers(params?: UserFilters): Promise<PaginatedAdminUsers> {
    const response = await adminApiClient.get<PaginatedAdminUsers>("/users/", { params });
    return response.data;
  },

  /**
   * Get user details
   * GET /admin/users/<id>/
   */
  async getUserById(userId: string): Promise<AdminUser> {
    const response = await adminApiClient.get<AdminUser>(`/users/${userId}/`);
    return response.data;
  },

  /**
   * Update user
   * PUT /admin/users/<id>/
   */
  async updateUser(
    userId: string,
    data: {
      email?: string;
      role?: "student" | "lecturer" | "admin";
      is_active?: boolean;
    }
  ): Promise<AdminUser> {
    const response = await adminApiClient.put<AdminUser>(`/users/${userId}/`, data);
    return response.data;
  },

  /**
   * Change user role
   * PUT /admin/users/<id>/role/
   */
  async changeUserRole(
    userId: string,
    role: "student" | "lecturer" | "admin"
  ): Promise<AdminUser> {
    const response = await adminApiClient.put<AdminUser>(`/users/${userId}/role/`, { role });
    return response.data;
  },

  /**
   * Activate user
   * POST /admin/users/<id>/activate/
   */
  async activateUser(userId: string): Promise<{ success: boolean }> {
    const response = await adminApiClient.post<{ success: boolean }>(`/users/${userId}/activate/`);
    return response.data;
  },

  /**
   * Deactivate user
   * POST /admin/users/<id>/deactivate/
   */
  async deactivateUser(userId: string): Promise<{ success: boolean }> {
    const response = await adminApiClient.post<{ success: boolean }>(`/users/${userId}/deactivate/`);
    return response.data;
  },

  // ── Course Management ────────────────────────────────────────────────────────

  /**
   * List all courses with filters
   * GET /admin/courses/
   */
  async getCourses(params?: CourseFilters): Promise<PaginatedAdminCourses> {
    const response = await adminApiClient.get<PaginatedAdminCourses>("/courses/", { params });
    return response.data;
  },

  /**
   * Get course details
   * GET /admin/courses/<id>/
   */
  async getCourseById(courseId: string): Promise<AdminCourse> {
    const response = await adminApiClient.get<AdminCourse>(`/courses/${courseId}/`);
    return response.data;
  },

  /**
   * Update course
   * PUT /admin/courses/<id>/
   */
  async updateCourse(
    courseId: string,
    data: {
      title?: string;
      code?: string;
      description?: string;
      department?: string | null;
      lecturer?: string | null;
      level?: string;
      lecturer_remark?: string;
    }
  ): Promise<AdminCourse> {
    const response = await adminApiClient.put<AdminCourse>(`/courses/${courseId}/`, data);
    return response.data;
  },

  /**
   * Delete course
   * DELETE /admin/courses/<id>/
   */
  async deleteCourse(courseId: string): Promise<{ success: boolean }> {
    const response = await adminApiClient.delete<void>(`/courses/${courseId}/`);
    return { success: response.status === 204 };
  },

  /**
   * Enroll student in course
   * POST /admin/courses/<id>/enroll-student/
   */
  async enrollStudent(
    courseId: string,
    studentId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await adminApiClient.post<{ success: boolean; message: string }>(
      `/courses/${courseId}/enroll-student/`,
      { student: studentId }
    );
    return response.data;
  },

  /**
   * Unenroll student from course
   * POST /admin/courses/<id>/unenroll-student/
   */
  async unenrollStudent(
    courseId: string,
    studentId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await adminApiClient.post<{ success: boolean; message: string }>(
      `/courses/${courseId}/unenroll-student/`,
      { student: studentId }
    );
    return response.data;
  },

  /**
   * Get course enrollments
   * GET /admin/courses/<id>/enrollments/
   */
  async getCourseEnrollments(courseId: string): Promise<CourseEnrollment[]> {
    const response = await adminApiClient.get<CourseEnrollment[]>(
      `/courses/${courseId}/enrollments/`
    );
    return response.data;
  },

  // ── Support / Contact Messages ─────────────────────────────────────────────

  /**
   * List contact messages
   * GET /admin/support/contacts/
   */
  async getContactMessages(): Promise<ContactMessage[]> {
    const response = await adminApiClient.get<ContactMessage[]>("/support/contacts/");
    return response.data;
  },

  // ── Issue Reports ─────────────────────────────────────────────────────────

  /**
   * List issue reports
   * GET /admin/support/reports/
   */
  async getIssueReports(params?: { resolved?: boolean }): Promise<IssueReport[]> {
    const response = await adminApiClient.get<IssueReport[]>("/support/reports/", { params });
    return response.data;
  },

  /**
   * Resolve issue report
   * PUT /admin/support/reports/<id>/resolve/
   */
  async resolveIssueReport(reportId: string): Promise<IssueReport> {
    const response = await adminApiClient.put<IssueReport>(
      `/support/reports/${reportId}/resolve/`
    );
    return response.data;
  },

  // ── Admin Requests ─────────────────────────────────────────────────────────

  /**
   * List admin requests
   * GET /admin/support/admin-requests/
   */
  async getAdminRequests(params?: { status?: "pending" | "approved" | "rejected" }): Promise<AdminRequest[]> {
    const response = await adminApiClient.get<AdminRequest[]>("/support/admin-requests/", { params });
    return response.data;
  },

  /**
   * Approve admin request
   * PUT /admin/support/admin-requests/<id>/approve/
   */
  async approveAdminRequest(requestId: string): Promise<AdminRequest> {
    const response = await adminApiClient.put<AdminRequest>(
      `/support/admin-requests/${requestId}/approve/`
    );
    return response.data;
  },

  /**
   * Reject admin request
   * PUT /admin/support/admin-requests/<id>/reject/
   */
  async rejectAdminRequest(requestId: string): Promise<AdminRequest> {
    const response = await adminApiClient.put<AdminRequest>(
      `/support/admin-requests/${requestId}/reject/`
    );
    return response.data;
  },
};

export default adminService;