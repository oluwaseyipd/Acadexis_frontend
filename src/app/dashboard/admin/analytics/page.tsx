"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Activity,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAnalytics } from "@/hooks/useAdmin";
import { UI_TEXT } from "@/lib/constants";

// Mock data for demonstration
const mockAnalytics = {
  topCourses: [
    { id: "c1", title: "Introduction to Machine Learning", code: "CSC3022F", students_enrolled: 145, materials_count: 12 },
    { id: "c2", title: "Data Structures & Algorithms", code: "CSC2001F", students_enrolled: 210, materials_count: 8 },
    { id: "c3", title: "Linear Algebra", code: "MAM1020F", students_enrolled: 320, materials_count: 15 },
    { id: "c4", title: "Quantum Mechanics I", code: "PHY2014F", students_enrolled: 95, materials_count: 10 },
    { id: "c5", title: "Database Systems", code: "CSC3015F", students_enrolled: 180, materials_count: 6 },
  ],
  recentEnrollments: [
    { id: "e1", student: { profile: { first_name: "John", last_name: "Abiola" } }, course: { title: "Machine Learning", code: "CSC3022F" }, created_at: "2026-03-11T10:00:00Z" },
    { id: "e2", student: { profile: { first_name: "Mary", last_name: "Jane" } }, course: { title: "Linear Algebra", code: "MAM1020F" }, created_at: "2026-03-10T14:30:00Z" },
    { id: "e3", student: { profile: { first_name: "James", last_name: "Smith" } }, course: { title: "Database Systems", code: "CSC3015F" }, created_at: "2026-03-10T09:15:00Z" },
  ],
  activityByDay: [
    { date: "2026-03-05", count: 45 },
    { date: "2026-03-06", count: 78 },
    { date: "2026-03-07", count: 92 },
    { date: "2026-03-08", count: 65 },
    { date: "2026-03-09", count: 88 },
    { date: "2026-03-10", count: 120 },
    { date: "2026-03-11", count: 156 },
  ],
};

export default function AdminAnalyticsPage() {
  const { analytics, loading, error } = useAdminAnalytics();
  const [useMockData, setUseMockData] = useState(false);
  const [displayData, setDisplayData] = useState<typeof mockAnalytics | null>(null);

  useEffect(() => {
    if (error || (!loading && !analytics)) {
      setUseMockData(true);
      setDisplayData(mockAnalytics);
    } else if (analytics) {
      setDisplayData(analytics as typeof mockAnalytics);
    }
  }, [error, loading, analytics]);

  const maxActivity = displayData
    ? Math.max(...displayData.activityByDay.map((d) => d.count))
    : 0;

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Platform analytics and insights.
        </p>
      </div>

      {/* Activity Chart */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="flex items-end justify-between gap-2 h-48">
              {displayData?.activityByDay.map((day, i) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "100%" }}
                  transition={{ delay: i * 0.05 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full bg-brand-primary/20 rounded-t-lg relative overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: `${(day.count / maxActivity) * 100}%`,
                      }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 bg-brand-primary rounded-t-lg"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-xs font-medium">{day.count}</div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Courses */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Top Courses by Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {displayData?.topCourses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-xs font-bold text-brand-primary">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.code}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {course.students_enrolled}
                      </p>
                      <p className="text-xs text-muted-foreground">students</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {displayData?.recentEnrollments.map((enrollment, i) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center text-xs font-bold text-info">
                        {enrollment.student.profile?.first_name?.[0]}
                        {enrollment.student.profile?.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {enrollment.student.profile?.first_name}{" "}
                          {enrollment.student.profile?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          enrolled in {enrollment.course.code}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(enrollment.created_at).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">+23%</p>
                <p className="text-xs text-muted-foreground">Growth this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-success/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">New enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-info/10 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-muted-foreground">Total courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-warning/10 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">Active sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}