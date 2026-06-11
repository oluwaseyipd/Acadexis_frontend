import { AuthUser } from "./user";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  level: string;
  department_id: string;
  departmentId?: string;
  lecturer_id: string;
  lecturerId?: string;
  lecturer_name: string;
  lecturerName?: string;
  lecturer?: AuthUser;
  materials_count: number;
  materialsCount?: number;
  students_enrolled: number;
  studentsEnrolled?: number;
  thumbnail: string | null;
  is_enrolled: boolean;
  isEnrolled?: boolean;
  lecturer_remark?: string;
  created_at: string;
  updated_at?: string;
}

export interface CourseModule {
  id: string;
  course: string;
  title: string;
  description: string;
  order: number;
  created_at: string;
}

export interface HeatmapData {
  topic: string;
  questions_asked: number;
  avg_confidence: number;
  struggling_students: number;
}

export interface EnrolledStudent {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  identification_number?: string;
  course_title: string;
  course_code: string;
  created_at: string;
  // Mapped/camelCased response properties
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  identificationNumber?: string;
  courseTitle?: string;
  courseCode?: string;
  createdAt?: string;
}
