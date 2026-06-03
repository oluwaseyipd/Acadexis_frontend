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

// Institutions API client (uses /api prefix)
const institutionsApiClient = axios.create({
  baseURL: `${ADMIN_BASE_URL}/api/institutions`,
  timeout: 30_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add auth interceptor for institutions requests
institutionsApiClient.interceptors.request.use(
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

// ─── CSRF Token Helper ───────────────────────────────────────────────────────
// Extract CSRF token from cookies
const getCsrfToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : null;
};

// Helper to get all cookies as a string (for debugging)
const getAllCookies = (): string => {
  if (typeof document === "undefined") return "";
  return document.cookie;
};

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
   * Fetch CSRF token - must be called before login to set the CSRF cookie
   *
   * Uses the dedicated /api/auth/csrf/ endpoint which uses @ensure_csrf_cookie
   * to force the CSRF cookie to be set. This is more reliable than using
   * /admin/login/ for cross-origin requests.
   *
   * For cross-origin requests with SameSite=None, the browser won't send
   * cookies automatically, so we need to fetch the CSRF cookie explicitly.
   */
  async fetchCsrfToken(): Promise<void> {
    try {
      // Use the dedicated CSRF endpoint
      await adminAuthClient.get("/api/auth/csrf/");
    } catch (error) {
      // Fallback: try the admin login page
      console.warn("CSRF endpoint failed, trying admin login:", error);
      try {
        await adminAuthClient.get("/admin/login/");
      } catch (altError) {
        console.error("Failed to fetch CSRF token:", altError);
        // Don't throw - we'll check if cookie was set anyway
      }
    }
  },

  /**
   * Admin login - uses custom DRF admin login endpoint instead of Django admin
   *
   * This endpoint (/api/auth/admin-login/) is built with DRF and handles
   * CSRF properly for cross-origin requests.
   *
   * Flow:
   * 1. Fetch CSRF token to set the cookie
   * 2. POST to /api/auth/admin-login/ with credentials
   */
  async login(payload: { username: string; password: string }): Promise<{
    access: string;
    refresh: string;
    user: { id: string; email: string; role: string; name: string; profile: any };
  }> {
    // Fetch CSRF token first (sets the csrftoken cookie)
    await this.fetchCsrfToken();

    // Get the CSRF token from cookies
    const csrfToken = getCsrfToken();

    // Debug: log all cookies for troubleshooting
    if (typeof window !== "undefined") {
      console.debug("Current cookies:", getAllCookies());
    }

    // Use the custom DRF admin login endpoint
    const response = await adminAuthClient.post<{
      access: string;
      refresh: string;
      user: any;
    }>(
      "/api/auth/admin-login/",
      {
        username: payload.username,
        password: payload.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        withCredentials: true,
      }
    );
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

  // ── Institutions (Universities, Faculties, Departments) ────────────────────────

  /**
   * List all universities
   * GET /api/universities/
   */
  async getUniversities(params?: { search?: string }): Promise<any[]> {
    const response = await institutionsApiClient.get<any[]>("/universities/", { params });
    return response.data;
  },

  /**
   * Create a university
   * POST /api/universities/
   */
  async createUniversity(data: { name: string; description?: string; code?: string }): Promise<any> {
    const response = await institutionsApiClient.post<any>("/universities/", data);
    return response.data;
  },

  /**
   * Get university by ID
   * GET /api/universities/<id>/
   */
  async getUniversityById(universityId: string): Promise<any> {
    const response = await institutionsApiClient.get<any>(`/universities/${universityId}/`);
    return response.data;
  },

  /**
   * Update university
   * PUT /api/universities/<id>/
   */
  async updateUniversity(universityId: string, data: { name?: string; description?: string; code?: string }): Promise<any> {
    const response = await institutionsApiClient.put<any>(`/universities/${universityId}/`, data);
    return response.data;
  },

  /**
   * Delete university
   * DELETE /api/universities/<id>/
   */
  async deleteUniversity(universityId: string): Promise<{ success: boolean }> {
    const response = await institutionsApiClient.delete<void>(`/universities/${universityId}/`);
    return { success: response.status === 204 };
  },

  /**
   * List all faculties
   * GET /api/faculties/
   */
  async getFaculties(params?: { university?: string }): Promise<any[]> {
    const response = await institutionsApiClient.get<any[]>("/faculties/", { params });
    return response.data;
  },

  /**
   * Create a faculty
   * POST /api/faculties/
   */
  async createFaculty(data: { name: string; university: string }): Promise<any> {
    const response = await institutionsApiClient.post<any>("/faculties/", data);
    return response.data;
  },

  /**
   * Get faculty by ID
   * GET /api/faculties/<id>/
   */
  async getFacultyById(facultyId: string): Promise<any> {
    const response = await institutionsApiClient.get<any>(`/faculties/${facultyId}/`);
    return response.data;
  },

  /**
   * Update faculty
   * PUT /api/faculties/<id>/
   */
  async updateFaculty(facultyId: string, data: { name?: string; university?: string }): Promise<any> {
    const response = await institutionsApiClient.put<any>(`/faculties/${facultyId}/`, data);
    return response.data;
  },

  /**
   * Delete faculty
   * DELETE /api/faculties/<id>/
   */
  async deleteFaculty(facultyId: string): Promise<{ success: boolean }> {
    const response = await institutionsApiClient.delete<void>(`/faculties/${facultyId}/`);
    return { success: response.status === 204 };
  },

  /**
   * List all departments
   * GET /api/departments/
   */
  async getDepartments(params?: { university?: string; faculty?: string }): Promise<any[]> {
    const response = await institutionsApiClient.get<any[]>("/departments/", { params });
    return response.data;
  },

  /**
   * Create a department
   * POST /api/departments/
   */
  async createDepartment(data: { name: string; code?: string; faculty: string }): Promise<any> {
    const response = await institutionsApiClient.post<any>("/departments/", data);
    return response.data;
  },

  /**
   * Get department by ID
   * GET /api/departments/<id>/
   */
  async getDepartmentById(departmentId: string): Promise<any> {
    const response = await institutionsApiClient.get<any>(`/departments/${departmentId}/`);
    return response.data;
  },

  /**
   * Update department
   * PUT /api/departments/<id>/
   */
  async updateDepartment(departmentId: string, data: { name?: string; code?: string; faculty?: string }): Promise<any> {
    const response = await institutionsApiClient.put<any>(`/departments/${departmentId}/`, data);
    return response.data;
  },

  /**
   * Delete department
   * DELETE /api/departments/<id>/
   */
  async deleteDepartment(departmentId: string): Promise<{ success: boolean }> {
    const response = await institutionsApiClient.delete<void>(`/departments/${departmentId}/`);
    return { success: response.status === 204 };
  },
};

export default adminService;