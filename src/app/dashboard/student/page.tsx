"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, FileText, TrendingUp, Clock, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UI_TEXT } from "@/lib/constants";
import type { Course } from "@/types/course";
import apiService from "@/services/apiService";
import type { StudySession } from "@/types/studylab";

export default function OverviewPage() {
    const { user } = useCurrentUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [recentSessions, setRecentSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const courseResponse = await apiService.courses.getMyCourses();
        if (!isMounted) return;
        setCourses(courseResponse.data || []);

        const sessions = await apiService.studyLab.getAllSessions();
        if (!isMounted) return;
        setRecentSessions(sessions || []);
      } catch {
        if (!isMounted) return;
        setCourses([]);
        setRecentSessions([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    { label: "Enrolled Courses", value: courses.length.toString(), icon: BookOpen, color: "text-primary" },
    { label: "Study Sessions", value: recentSessions.length.toString(), icon: Clock, color: "text-info" },
    { label: "Materials Read", value: "0", icon: FileText, color: "text-success" },
    { label: "AI Questions", value: "0", icon: TrendingUp, color: "text-warning" },
  ];
    return (
        <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {UI_TEXT.dashboard.welcomeBack}, {user?.profile?.firstName || "User"}
        </h1>
        <p className="text-muted-foreground mt-1">Here is what is happening with your courses.</p>
      </div>


            {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="shadow-card">
              <CardContent className="p-4">
                {loading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className={`${stat.color}`}>
                      <stat.icon className="h-8 w-8" />
                    </div>
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

      {/* Latest Course & Recent Study */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Latest Course */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Latest Course</h2>
          {loading ? (
            <Card className="shadow-card"><CardContent className="p-5"><Skeleton className="h-32 w-full" /></CardContent></Card>
          ) : courses.length > 0 ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">{courses[0].code}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> {courses[0].studentsEnrolled ?? courses[0].students_enrolled ?? 0}
                    </span>
                  </div>
                  <CardTitle className="text-base">{courses[0].title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">{courses[0].description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{courses[0].lecturerName ?? courses[0].lecturer_name}</span>
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {courses[0].materialsCount ?? courses[0].materials_count ?? 0} materials</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="shadow-card"><CardContent className="p-5 text-sm text-muted-foreground">No courses added yet.</CardContent></Card>
          )}
        </div>

        {/* Recent Study */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Recent Study</h2>
          {loading ? (
            <Card className="shadow-card"><CardContent className="p-5"><Skeleton className="h-32 w-full" /></CardContent></Card>
          ) : recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.slice(0, 3).map((session, i) => (
                <motion.div key={session.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="shadow-card">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="text-primary mt-0.5"><MessageSquare className="h-4 w-4" /></div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-card-foreground line-clamp-2">{session.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(session.created_at).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="shadow-card"><CardContent className="p-5 text-sm text-muted-foreground">No recent study activity.</CardContent></Card>
          )}
        </div>
      </div>
    </div>
    )
}