"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, FileText, Search, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import apiService from "@/services/apiService";
import { useCourses } from "@/hooks/useCourses";
import { type Course } from "@/types/course";
import { toast } from "sonner";

export default function ManageCourses() {
  const [search, setSearch] = useState("");
  const { courses, isLoading: loading, error, refetch } = useCourses({ mode: "all", search });
  const filtered = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleEnroll = async (courseId: string) => {
    try {
      await apiService.courses.enroll(courseId);
      await refetch();
      toast.success("Course enrollment updated.");
    } catch {
      toast.error("Unable to enroll in course. Please try again.");
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Courses</h1>
          <p className="text-muted-foreground">Browse available courses for your department</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-32 w-full" /></CardContent></Card>
          ))
        ) : error ? (
          <div className="col-span-full flex justify-center items-center py-16 text-sm text-destructive">Unable to load courses. Please refresh to try again.</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-16 text-sm text-muted-foreground">No courses available.</div>
        ) : (
          filtered.map((course, i) => (
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
                    {course.is_enrolled && <Badge variant="secondary" className="text-xs">Enrolled</Badge>}
                  </div>
                  <Link href={`/dashboard/student/manage-courses/${course.id}`}>
                    <CardTitle className="text-base mt-2 hover:text-primary transition-colors cursor-pointer">{course.title}</CardTitle>
                  </Link>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{course.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{course.lecturer_name}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.students_enrolled}</span>
                      <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{course.materials_count}</span>
                    </div>
                    {course.is_enrolled ? (
                      <Badge className="text-xs">Enrolled</Badge>
                    ) : (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleEnroll(course.id)}>
                        <Plus className="h-3 w-3 mr-1" /> Enroll
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
