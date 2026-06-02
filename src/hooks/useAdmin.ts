"use client";

import { useState, useEffect, useCallback } from "react";
import adminService from "@/services/adminService";
import type {
  AdminStatistics,
  PaginatedAdminUsers,
  PaginatedAdminCourses,
  UserFilters,
  CourseFilters,
  ContactMessage,
  IssueReport,
  AdminRequest,
  CourseEnrollment,
  AnalyticsOverview,
} from "@/types/admin";

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Get admin dashboard statistics
 */
export function useAdminStats() {
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getStatistics();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

/**
 * Get analytics overview
 */
export function useAdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAnalyticsOverview();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics };
}

/**
 * Get paginated users with filters
 */
export function useAdminUsers(filters?: UserFilters) {
  const [users, setUsers] = useState<PaginatedAdminUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getUsers(filters);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [filters?.role, filters?.university, filters?.is_active, filters?.search, filters?.page, filters?.page_size, filters?.ordering]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

/**
 * Activate a user
 */
export function useActivateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activate = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminService.activateUser(userId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate user");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { activate, loading, error };
}

/**
 * Deactivate a user
 */
export function useDeactivateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deactivate = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminService.deactivateUser(userId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deactivate user");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deactivate, loading, error };
}

/**
 * Change user role
 */
export function useChangeUserRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeRole = useCallback(async (userId: string, role: "student" | "lecturer" | "admin") => {
    setLoading(true);
    setError(null);
    try {
      await adminService.changeUserRole(userId, role);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change role");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { changeRole, loading, error };
}

/**
 * Get paginated courses with filters
 */
export function useAdminCourses(filters?: CourseFilters) {
  const [courses, setCourses] = useState<PaginatedAdminCourses | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getCourses(filters);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  }, [filters?.department, filters?.lecturer, filters?.level, filters?.search, filters?.page, filters?.page_size, filters?.ordering]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
}

/**
 * Delete a course
 */
export function useDeleteCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCourse = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminService.deleteCourse(courseId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteCourse, loading, error };
}

/**
 * Get course enrollments
 */
export function useCourseEnrollments(courseId: string) {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getCourseEnrollments(courseId);
      setEnrollments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return { enrollments, loading, error, refetch: fetchEnrollments };
}

/**
 * Get contact messages
 */
export function useContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getContactMessages();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, refetch: fetchMessages };
}

/**
 * Get issue reports
 */
export function useIssueReports(resolved?: boolean) {
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getIssueReports({ resolved });
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, [resolved]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, error, refetch: fetchReports };
}

/**
 * Resolve issue report
 */
export function useResolveReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = useCallback(async (reportId: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminService.resolveIssueReport(reportId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve report");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { resolve, loading, error };
}

/**
 * Get admin requests
 */
export function useAdminRequests(status?: "pending" | "approved" | "rejected") {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAdminRequests({ status });
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, refetch: fetchRequests };
}

/**
 * Approve admin request
 */
export function useApproveAdminRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approve = useCallback(async (requestId: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminService.approveAdminRequest(requestId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve request");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { approve, loading, error };
}

/**
 * Reject admin request
 */
export function useRejectAdminRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reject = useCallback(async (requestId: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminService.rejectAdminRequest(requestId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject request");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reject, loading, error };
}