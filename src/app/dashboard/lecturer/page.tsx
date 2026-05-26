"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, FileText, BarChart3, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/useAppStore";
import { api, type Course, type HeatmapData } from "@/services/api";
import { UI_TEXT } from "@/lib/constants";

export default function LecturerOverview() {
  const user = useAppStore((s) => s.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getCourses(), api.getHeatmapData("c1")]).then(([c, h]) => {
      setCourses(c);
      setHeatmap(h);
      setLoading(false);
    });
  }, []);

  const totalStudents = courses.reduce((s, c) => s + c.studentsEnrolled, 0);
  const topStruggle = heatmap.sort((a, b) => a.avgConfidence - b.avgConfidence)[0];

  const stats = [
    { label: "Active Courses", value: courses.length.toString(), icon: BookOpen, color: "text-primary" },
    { label: "Total Students", value: totalStudents.toString(), icon: Users, color: "text-info" },
    { label: "Materials Uploaded", value: courses.reduce((s, c) => s + c.materialsCount, 0).toString(), icon: FileText, color: "text-success" },
    { label: "Struggle Alerts", value: heatmap.filter((h) => h.avgConfidence < 0.4).length.toString(), icon: AlertTriangle, color: "text-warning" },
  ];

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {UI_TEXT.dashboard.welcomeBack}, {user?.firstName || "Professor"} 👋
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

      {/* Top struggle alert */}
      {topStruggle && !loading && (
        <Card className="border-warning/30 bg-warning/5 shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
            <div>
              <p className="font-medium text-card-foreground">Students struggling with: {topStruggle.topic}</p>
              <p className="text-sm text-muted-foreground">
                {topStruggle.strugglingStudents} students, {topStruggle.questionsAsked} questions asked, {Math.round(topStruggle.avgConfidence * 100)}% avg confidence
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Your Courses</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Card key={i} className="shadow-card"><CardContent className="p-5"><Skeleton className="h-24 w-full" /></CardContent></Card>)
            : courses.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">{course.code}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> {course.studentsEnrolled}</span>
                      </div>
                      <CardTitle className="text-base">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                      <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {course.materialsCount} materials
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  );
}
