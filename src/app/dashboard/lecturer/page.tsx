"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCourses } from "@/hooks/useCourses";
import { useHeatmap } from "@/hooks/useHeatmap";
import { HeatmapChart } from "@/components/HeatmapChart";
import { HeatmapSummary } from "@/components/HeatmapSummary";
import { type Course } from "@/types/course";
import { UI_TEXT } from "@/lib/constants";

export default function LecturerOverview() {
  const { user } = useCurrentUser();
  const { courses, isLoading: loading } = useCourses({ mode: "mine" });
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const { cells, isLoading: heatmapLoading, error: heatmapError } = useHeatmap({ courseId: selectedCourseId });

  useEffect(() => {
    if (!selectedCourseId && courses.length > 0) {
      setTimeout(() => setSelectedCourseId(courses[0].id), 0);
    }
  }, [courses, selectedCourseId]);

  const totalStudents = courses.reduce((s, c) => s + c.students_enrolled, 0);

  const stats = [
    { label: "Active Courses", value: courses.length.toString(), icon: BookOpen, color: "text-primary" },
    { label: "Total Students", value: totalStudents.toString(), icon: Users, color: "text-info" },
    { label: "Materials Uploaded", value: courses.reduce((s, c) => s + c.materials_count, 0).toString(), icon: FileText, color: "text-success" },
    { label: "Struggle Alerts", value: cells.filter((cell) => cell.avgConfidence < 0.4).length.toString(), icon: AlertTriangle, color: "text-warning" },
  ];

  return ( 
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {UI_TEXT.dashboard.welcomeBack}, {user?.profile?.firstName || "User"}
        </h1>
        <p className="text-muted-foreground mt-1">Your teaching dashboard at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="shadow-card">
              <CardContent className="p-4">
                {loading ? <Skeleton className="h-16 w-full" /> : (
                  <div className="flex items-center gap-3">
                    <div className={stat.color}><stat.icon className="h-8 w-8" /></div>
                    <div>
                      <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Heatmap Analytics</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Track topics where students are struggling and surface the lowest confidence areas.
              </p>
              <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
                <label htmlFor="course-select" className="text-sm text-muted-foreground">
                  Select course:
                </label>
                <select
                  id="course-select"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} — {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <HeatmapSummary cells={cells} />

          {heatmapLoading ? (
            <div className="rounded-2xl border border-border bg-card p-6">
              <Skeleton className="h-72 w-full" />
            </div>
          ) : heatmapError ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              {heatmapError}
            </div>
          ) : cells.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              No analytics data yet. Data appears as students ask questions in the study lab.
            </div>
          ) : (
            <HeatmapChart cells={cells} />
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground mb-3">Your Courses</h2>
          <div className="grid md:grid-cols-1 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Card key={i} className="shadow-card"><CardContent className="p-5"><Skeleton className="h-24 w-full" /></CardContent></Card>)
            : courses.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">{course.code}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> {course.students_enrolled}</span>
                      </div>
                      <CardTitle className="text-base">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                      <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {course.materials_count} materials
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  </div>
  );
}
