"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Loader2, X, Cloud, ChevronRight, BookOpen, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import apiService from "@/services/apiService";
import { type Course } from "@/types/course";
import { UI_TEXT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useMaterials } from "@/hooks/useMaterials";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useNotificationStore } from "@/store/notificationStore";

function KnowledgeHubContent() {
  const searchParams = useSearchParams();
  const queryCourseId = searchParams.get("courseId") ?? "";
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(queryCourseId);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const { materials, loading: materialsLoading, refresh, setMaterials } = useMaterials(selectedCourse || null);
  const { uploading, uploadFile } = useFileUpload();
  const notifications = useNotificationStore((state) => state.notifications);
  const prevFirstNotificationId = useRef<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const response = await apiService.courses.getMyCourses();
        setCourses(response.data);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    void loadCourses();
  }, []);

  useEffect(() => {
    const firstNotification = notifications[0];

    if (
      !firstNotification ||
      firstNotification.id === prevFirstNotificationId.current ||
      firstNotification.notification_type !== "material_ready"
    ) {
      return;
    }

    if (firstNotification.data?.course_id === selectedCourse) {
      prevFirstNotificationId.current = firstNotification.id;
      void refresh();
    }
  }, [notifications, refresh, selectedCourse]);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedCourse) return;
    setUploadProgress(0);
    const interval = setInterval(() => setUploadProgress((p) => Math.min(p + 15, 90)), 300);
    try {
      await uploadFile({ course: selectedCourse, file: files[0] });
      setUploadProgress(100);
      await refresh();
    } catch {
      setUploadProgress(0);
    } finally {
      setTimeout(() => {
        setUploadProgress(0);
      }, 500);
      clearInterval(interval);
    }
  }, [selectedCourse, refresh, uploadFile]);

  const handleDelete = async (materialId: string) => {
    try {
      await apiService.materials.deleteMaterial(materialId);
      setMaterials((prev) => prev.filter((item) => item.id !== materialId));
    } catch {
      // ignore delete errors for now
    }
  };

  const statusIcon = (status: string) => {
    if (status === "ready") return <CheckCircle className="h-4 w-4 text-success" />;
    if (status === "processing") return <Loader2 className="h-4 w-4 animate-spin text-warning" />;
    return <X className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{UI_TEXT.dashboard.knowledgeHub}</h1>
        <p className="text-muted-foreground">Upload and manage course materials for AI grounding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
        {/* Left Column: Course Selector */}
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-lg font-semibold text-foreground">Your Courses</h2>
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto pb-3 lg:pb-0 lg:overflow-x-visible scrollbar-thin snap-x">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border bg-card space-y-2.5 animate-pulse shrink-0 w-[260px] lg:w-full"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-20 bg-muted rounded-full" />
                    <div className="h-4 w-12 bg-muted rounded" />
                  </div>
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              ))
            ) : courses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center w-full bg-card">
                <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2 opacity-60" />
                <p className="text-sm font-medium text-foreground">No courses found</p>
                <p className="text-xs text-muted-foreground mt-1">You are not assigned to any courses yet.</p>
              </div>
            ) : (
              courses.map((course) => {
                const isSelected = selectedCourse === course.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={cn(
                      "text-left p-4 rounded-xl border transition-all duration-200 flex flex-col gap-2 relative overflow-hidden group shrink-0 w-[260px] lg:w-full snap-start",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border bg-card hover:bg-accent/40 text-foreground"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
                    )}
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs font-mono px-2 py-0.5 rounded-full font-medium uppercase tracking-wider",
                          isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {course.code}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" /> {course.studentsEnrolled ?? course.students_enrolled ?? 0}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 font-normal">
                          {course.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {course.materialsCount ?? course.materials_count ?? 0} materials
                      </span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground/60 group-hover:translate-x-0.5"
                        )}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Upload Zone & Materials List */}
        <div className="flex-1 min-w-0 w-full">
          {!selectedCourse ? (
            <Card className="border border-dashed border-border shadow-none h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-card/40 backdrop-blur-sm">
              <div className="h-16 w-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4 border border-primary/10 shadow-inner">
                <Cloud className="h-8 w-8 animate-pulse-slow" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Course Selected</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Choose a course from the panel to start uploading course materials, managing files, and training the AI model.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground border-t border-border pt-6 w-full max-w-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Select Course</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cloud className="h-4 w-4 text-primary" />
                  <span>Upload Materials</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-info" />
                  <span>Manage Files</span>
                </div>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Active course title header banner */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {courses.find((c) => c.id === selectedCourse)?.code} — {courses.find((c) => c.id === selectedCourse)?.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Managing training materials for this course
                  </p>
                </div>
              </div>

              {/* Upload zone */}
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer",
                      dragOver ? "border-primary bg-accent/50" : "border-border hover:border-primary/50",
                      uploading && "pointer-events-none opacity-60"
                    )}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleUpload(e.dataTransfer.files);
                    }}
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = ".pdf,.doc,.docx,.pptx";
                      input.onchange = (e) => handleUpload((e.target as HTMLInputElement).files);
                      input.click();
                    }}
                  >
                    <Cloud className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-foreground font-medium">Drag & drop files here or click to browse</p>
                    <p className="text-sm text-muted-foreground mt-1">PDF, DOCX, PPTX — Max 50MB</p>
                  </div>

                  {uploading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-foreground">
                          {uploadProgress < 100 ? "Uploading..." : "Upload complete!"}
                        </span>
                        <span className="text-sm text-muted-foreground ml-auto">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Materials list */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Uploaded Materials</h2>
                <div className="space-y-2">
                  {materialsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="shadow-card">
                        <CardContent className="p-4">
                          <div className="h-12 bg-muted animate-pulse rounded" />
                        </CardContent>
                      </Card>
                    ))
                  ) : materials.length === 0 ? (
                    <Card className="shadow-card">
                      <CardContent className="p-6 text-sm text-muted-foreground">
                        No materials uploaded for this course yet.
                      </CardContent>
                    </Card>
                  ) : (
                    materials.map((mat, i) => (
                      <motion.div
                        key={mat.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card className="shadow-card">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                              <FileText className="h-5 w-5 text-accent-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{mat.fileName ?? mat.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(mat.pageCount ?? mat.page_count ?? 0) > 0 ? `${mat.pageCount ?? mat.page_count} pages • ` : ""}
                                {(((mat.fileSize ?? mat.file_size ?? 0) / 1024 / 1024).toFixed(1))} MB
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {statusIcon(mat.status)}
                              <span className="text-xs text-muted-foreground capitalize">{mat.status}</span>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                              <a href={mat.file} target="_blank" rel="noreferrer">
                                Download
                              </a>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => void handleDelete(mat.id)}>
                              {UI_TEXT.common.delete}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KnowledgeHub() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground flex items-center justify-center min-h-[400px]">Loading Knowledge Hub...</div>}>
      <KnowledgeHubContent />
    </Suspense>
  );
}
