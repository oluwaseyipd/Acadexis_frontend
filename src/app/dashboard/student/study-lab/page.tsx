"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, BookOpen, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiService from "@/services/apiService";
import { UI_TEXT } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";
import type { StudySession } from "@/types/studylab";

export default function StudyLab() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.courses.getMyCourses();
        setCourses(response.data);
        if (response.data.length > 0) {
          setSelectedCourse(response.data[0].id);
        }
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  useEffect(() => {
    if (!selectedCourse) {
      setSessions([]);
      return;
    }

    const loadSessions = async () => {
      setLoadingSessions(true);
      try {
        const data = await apiService.studyLab.getSessionsForCourse(selectedCourse);
        setSessions(data);
      } catch {
        setSessions([]);
      } finally {
        setLoadingSessions(false);
      }
    };

    void loadSessions();
  }, [selectedCourse]);

  const course = courses.find((courseItem) => courseItem.id === selectedCourse);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.75) return "text-green-500";
    if (score >= 0.5) return "text-yellow-500";
    return "text-red-500";
  };

  const getConfidenceBg = (score: number) => {
    if (score >= 0.75) return "bg-green-500/10";
    if (score >= 0.5) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{UI_TEXT.studyLab.title}</h1>
          <p className="text-sm text-muted-foreground">{UI_TEXT.studyLab.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {courses.length > 1 && (
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((courseItem) => (
                  <SelectItem key={courseItem.id} value={courseItem.id}>
                    {courseItem.code} - {courseItem.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            variant="hero"
            disabled={!selectedCourse}
            onClick={() => router.push(`/dashboard/student/study-lab/study-session/new?courseId=${selectedCourse}`)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> New Study
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading || loadingSessions ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))
) : sessions.length === 0 ? (
  <div className="col-span-full flex justify-center items-center py-16">
    <div className="p-8 text-center text-sm text-muted-foreground max-w-sm w-full">
      {selectedCourse
        ? "No study sessions exist for this course yet. Start a new one above."
        : "You are not enrolled in any courses yet."}
    </div>
  </div>
) : (
          sessions.map((session, idx) => {
            const courseItem = courses.find((item) => item.id === session.course);
            const confidencePercent = Math.round(session.confidence_score * 100);

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                  onClick={() => router.push(`/dashboard/student/study-lab/study-session/${session.id}?courseId=${selectedCourse}`)}
                >
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {session.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {session.description || "No description available."}
                      </p>
                    </div>

                    <Badge variant="secondary" className="text-xs">
                      <BookOpen className="h-3 w-3 mr-1" /> {courseItem ? `${courseItem.code} - ${courseItem.title}` : session.course}
                    </Badge>

                    <div className="space-y-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Session summary</span>
                      <p className="text-sm text-foreground/80 line-clamp-3">
                        {session.description || "No summary available."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /> {formatDate(session.created_at)}
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full",
                          getConfidenceBg(confidencePercent / 100),
                          getConfidenceColor(confidencePercent / 100)
                        )}
                      >
                        <TrendingUp className="h-3 w-3" /> {confidencePercent}%
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
