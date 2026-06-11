"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, FileText, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import apiService from "@/services/apiService";
import { Course } from "@/types/course";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.courses.getMyCourses();
        setCourses(response.data || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const removeCourse = async (id: string) => {
    try {
      await apiService.courses.unenroll(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to unenroll from course:", err);
      setError("Failed to unenroll from course. Please try again.");
    }
  };

  return (
    // A grid display of courses with cards showing course name, description, and progress
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
        <p className="text-muted-foreground">Courses you have added to your study plan</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card className="shadow-card border-destructive">
          <CardContent className="p-12 text-center">
            <p className="text-lg font-medium text-destructive mb-1">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : courses.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">No courses yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Browse the course catalog and add courses to get started.
            </p>
                <Button asChild>
              <Link href="/dashboard/student/manage-courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-card hover:shadow-card-hover transition-shadow h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{course.code}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">Enrolled</Badge>
                  </div>
                  <Link href={`/dashboard/student/library/${course.id}`}>
                    <CardTitle className="text-base mt-2 hover:text-primary transition-colors cursor-pointer">{course.title}</CardTitle>
                  </Link>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{course.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{course.lecturer_name}</span>
                      <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{course.materials_count}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeCourse(course.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
