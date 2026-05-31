export type MaterialStatus = "processing" | "ready" | "failed";
export type MaterialFileType = "pdf" | "docx" | "pptx";

export interface CourseMaterial {
  id: string;
  course_id: string;
  courseId?: string;
  file: string;
  file_name: string;
  fileName?: string;
  file_type: MaterialFileType;
  fileType?: MaterialFileType;
  file_size: number;
  fileSize?: number;
  page_count: number | null;
  pageCount?: number | null;
  status: MaterialStatus;
  uploaded_by: string;
  uploaded_at: string;
  uploadedAt?: string;
  created_at: string;
}

export interface MaterialUploadPayload {
  course: string;
  file: File;
}
