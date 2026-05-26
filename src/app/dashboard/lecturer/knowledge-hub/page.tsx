"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, Loader2, X, Cloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, type Course, type CourseMaterial } from "@/services/api";
import { UI_TEXT } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function KnowledgeHub() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    api.getCourses().then((c) => {
      setCourses(c);
      if (c.length) setSelectedCourse(c[0].id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    api.getCourseMaterials(selectedCourse).then(setMaterials);
  }, [selectedCourse]);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedCourse) return;
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => setUploadProgress((p) => Math.min(p + 15, 90)), 300);
    try {
      await api.uploadMaterial(selectedCourse, files[0]);
      setUploadProgress(100);
      setTimeout(() => {
        api.getCourseMaterials(selectedCourse).then(setMaterials);
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch {
      setUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(interval);
    }
  }, [selectedCourse]);

  const statusIcon = (status: string) => {
    if (status === "ready") return <CheckCircle className="h-4 w-4 text-success" />;
    if (status === "processing") return <Loader2 className="h-4 w-4 animate-spin text-warning" />;
    return <X className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{UI_TEXT.dashboard.knowledgeHub}</h1>
          <p className="text-muted-foreground">Upload and manage course materials for AI grounding</p>
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-64"><SelectValue placeholder="Select course" /></SelectTrigger>
          <SelectContent>
            {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.code} - {c.title}</SelectItem>)}
          </SelectContent>
        </Select>
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
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
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
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-foreground">{uploadProgress < 100 ? "Uploading..." : "Upload complete!"}</span>
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
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="shadow-card"><CardContent className="p-4"><div className="h-12 bg-muted animate-pulse rounded" /></CardContent></Card>
            ))
          ) : materials.map((mat, i) => (
            <motion.div key={mat.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-card">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{mat.fileName}</p>
                    <p className="text-xs text-muted-foreground">{mat.pageCount} pages • {(mat.fileSize / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcon(mat.status)}
                    <span className="text-xs text-muted-foreground capitalize">{mat.status}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    {UI_TEXT.common.delete}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
