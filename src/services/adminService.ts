import apiClient from "./api-client";
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

// ─── Admin Service ─────────────────────────────────────────────────────────────

const adminService = {
  // ── Statistics ───────────────────────────────────────────────────────────────

  /**
   * Get dashboard statistics
   * GET /api/admin/statistics/
   */
  async getStatistics(): Promise<AdminStatistics> {
    const response = await apiClient.get<AdminStatistics>("/admin/statistics/");
    return response.data;
  },

  /**
   * Get analytics overview
   * GET /api/admin/analytics/overview/
   */
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const response = await apiClient.get<AnalyticsOverview>("/admin/analytics/overview/");
    return response.data;
  },

  // ── User Management ─────────────────────────────────────────────────────────

  /**
   * List all users with filters
   * GET /api/admin/users/
   */
  async getUsers(params?: UserFilters): Promise<PaginatedAdminUsers> {
    const response = await apiClient.get<PaginatedAdminUsers>("/admin/users/", {
      params,
    });
    return response.data;
  },

  /**
   * Get user details
   * GET /api/admin/users/<id>/
   */
  async getUserById(userId: string): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>(`/admin/users/${userId}/`);
    return response.data;
  },

  /**
   * Update user
   * PUT /api/admin/users/<id>/
   */
  async updateUser(
    userId: string,
    data: {
      email?: string;
      role?: "student" | "lecturer" | "admin";
      is_active?: boolean;
    }
  ): Promise<AdminUser> {
    const response = await apiClient.put<AdminUser>(`/admin/users/${userId}/`, data);
    return response.data;
  },

  /**
   * Change user role
   * PUT /api/admin/users/<id>/role/
   */
  async changeUserRole(
    userId: string,
    role: "student" | "lecturer" | "admin"
  ): Promise<AdminUser> {
    const response = await apiClient.put<AdminUser>(`/admin/users/${userId}/role/`, { role });
    return response.data;
  },

  /**
   * Activate user
   * POST /api/admin/users/<id>/activate/
   */
  async activateUser(userId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(`/admin/users/${userId}/activate/`);
    return response.data;
  },

  /**
   * Deactivate user
   * POST /api/admin/users/<id>/deactivate/
   */
  async deactivateUser(userId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(`/admin/users/${userId}/deactivate/`);
    return response.data;
  },

  // ── Course Management ────────────────────────────────────────────────────────

  /**
   * List all courses with filters
   * GET /api/admin/courses/
   */
  async getCourses(params?: CourseFilters): Promise<PaginatedAdminCourses> {
    const response = await apiClient.get<PaginatedAdminCourses>("/admin/courses/", {
      params,
    });
    return response.data;
  },

  /**
   * Get course details
   * GET /api/admin/courses/<id>/
   */
  async getCourseById(courseId: string): Promise<AdminCourse> {
    const response = await apiClient.get<AdminCourse>(`/admin/courses/${courseId}/`);
    return response.data;
  },

  /**
   * Update course
   * PUT /api/admin/courses/<id>/
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
    const response = await apiClient.put<AdminCourse>(`/admin/courses/${courseId}/`, data);
    return response.data;
  },

  /**
   * Delete course
   * DELETE /api/admin/courses/<id>/
   */
  async deleteCourse(courseId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<void>(`/admin/courses/${courseId}/`);
    return { success: response.status === 204 };
  },

  /**
   * Enroll student in course
   * POST /api/admin/courses/<id>/enroll-student/
   */
  async enrollStudent(
    courseId: string,
    studentId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `/admin/courses/${courseId}/enroll-student/`,
      { student: studentId }
    );
    return response.data;
  },

  /**
   * Unenroll student from course
   * DELETE /api/admin/courses/<id>/unenroll-student/
   */
  async unenrollStudent(
    courseId: string,
    studentId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `/admin/courses/${courseId}/unenroll-student/`,
      { student: studentId }
    );
    return response.data;
  },

  /**
   * Get course enrollments
   * GET /api/admin/courses/<id>/enrollments/
   */
  async getCourseEnrollments(courseId: string): Promise<CourseEnrollment[]> {
    const response = await apiClient.get<CourseEnrollment[]>(
      `/admin/courses/${courseId}/enrollments/`
    );
    return response.data;
  },

  // ── Support / Contact Messages ─────────────────────────────────────────────

  /**
   * List contact messages
   * GET /api/admin/support/contacts/
   */
  async getContactMessages(): Promise<ContactMessage[]> {
    const response = await apiClient.get<ContactMessage[]>("/admin/support/contacts/");
    return response.data;
  },

  // ── Issue Reports ─────────────────────────────────────────────────────────

  /**
   * List issue reports
   * GET /api/admin/support/reports/
   */
  async getIssueReports(params?: { resolved?: boolean }): Promise<IssueReport[]> {
    const response = await apiClient.get<IssueReport[]>("/admin/support/reports/", {
      params,
    });
    return response.data;
  },

  /**
   * Resolve issue report
   * PUT /api/admin/support/reports/<id>/resolve/
   */
  async resolveIssueReport(reportId: string): Promise<IssueReport> {
    const response = await apiClient.put<IssueReport>(
      `/admin/support/reports/${reportId}/resolve/`
    );
    return response.data;
  },

  // ── Admin Requests ─────────────────────────────────────────────────────────

  /**
   * List admin requests
   * GET /api/admin/support/admin-requests/
   */
  async getAdminRequests(params?: { status?: "pending" | "approved" | "rejected" }): Promise<AdminRequest[]> {
    const response = await apiClient.get<AdminRequest[]>("/admin/support/admin-requests/", {
      params,
    });
    return response.data;
  },

  /**
   * Approve admin request
   * PUT /api/admin/support/admin-requests/<id>/approve/
   */
  async approveAdminRequest(requestId: string): Promise<AdminRequest> {
    const response = await apiClient.put<AdminRequest>(
      `/admin/support/admin-requests/${requestId}/approve/`
    );
    return response.data;
  },

  /**
   * Reject admin request
   * PUT /api/admin/support/admin-requests/<id>/reject/
   */
  async rejectAdminRequest(requestId: string): Promise<AdminRequest> {
    const response = await apiClient.put<AdminRequest>(
      `/admin/support/admin-requests/${requestId}/reject/`
    );
    return response.data;
  },
};

export default adminService;