"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Plus,
  MoreVertical,
  Users,
  FileText,
  Calendar,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCourses, useDeleteCourse } from "@/hooks/useAdmin";
import type { AdminCourse, CourseFilters } from "@/types/admin";
import { UI_TEXT } from "@/lib/constants";

// Mock data for demonstration
const mockCourses: AdminCourse[] = [
  {
    id: "c1",
    title: "Introduction to Machine Learning",
    code: "CSC3022F",
    description: "Fundamentals of supervised and unsupervised learning, neural networks, and practical applications.",
    department: "d1",
    departmentName: "Computer Science",
    lecturer: "l1",
    lecturerName: "Prof. Sarah Chen",
    thumbnail: null,
    level: "300 Level",
    lecturer_remark: "Spring 2026",
    materials_count: 12,
    students_enrolled: 145,
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2026-03-10T14:30:00Z",
  },
  {
    id: "c2",
    title: "Data Structures & Algorithms",
    code: "CSC2001F",
    description: "Core data structures, algorithm design, and computational complexity analysis.",
    department: "d1",
    departmentName: "Computer Science",
    lecturer: "l1",
    lecturerName: "Prof. Sarah Chen",
    thumbnail: null,
    level: "200 Level",
    lecturer_remark: "Fall 2025",
    materials_count: 8,
    students_enrolled: 210,
    created_at: "2025-08-01T09:00:00Z",
    updated_at: "2026-02-20T11:00:00Z",
  },
  {
    id: "c3",
    title: "Linear Algebra",
    code: "MAM1020F",
    description: "Vector spaces, matrices, eigenvalues, and applications in data science.",
    department: "d3",
    departmentName: "Mathematics",
    lecturer: "l2",
    lecturerName: "Dr. James Moyo",
    thumbnail: null,
    level: "100 Level",
    lecturer_remark: "Spring 2026",
    materials_count: 15,
    students_enrolled: 320,
    created_at: "2025-01-10T08:00:00Z",
    updated_at: "2026-03-08T16:00:00Z",
  },
  {
    id: "c4",
    title: "Quantum Mechanics I",
    code: "PHY2014F",
    description: "Wave-particle duality, Schrödinger equation, and quantum states.",
    department: "d4",
    departmentName: "Physics",
    lecturer: "l3",
    lecturerName: "Prof. Amira Patel",
    thumbnail: null,
    level: "200 Level",
    lecturer_remark: "Fall 2025",
    materials_count: 10,
    students_enrolled: 95,
    created_at: "2025-07-20T12:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "c5",
    title: "Database Systems",
    code: "CSC3015F",
    description: "Relational databases, SQL, normalization, and transaction management.",
    department: "d1",
    departmentName: "Computer Science",
    lecturer: "l1",
    lecturerName: "Prof. Sarah Chen",
    thumbnail: null,
    level: "300 Level",
    lecturer_remark: "Spring 2026",
    materials_count: 6,
    students_enrolled: 180,
    created_at: "2025-02-01T10:00:00Z",
    updated_at: "2026-03-01T09:00:00Z",
  },
];

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [useMockData, setUseMockData] = useState(false);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const filters: CourseFilters = {
    search: search || undefined,
    level: levelFilter !== "all" ? levelFilter : undefined,
    page,
    page_size: 10,
    ordering: "-created_at",
  };

  const { courses: fetchedCourses, loading: apiLoading, error } = useAdminCourses(filters);
  const { deleteCourse, loading: deleting } = useDeleteCourse();

  useEffect(() => {
    if (error || (!apiLoading && !fetchedCourses)) {
      setUseMockData(true);
    }
  }, [error, apiLoading, fetchedCourses]);

  useEffect(() => {
    if (useMockData) {
      setLoading(false);
      let filtered = [...mockCourses];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.title.toLowerCase().includes(s) ||
            c.code.toLowerCase().includes(s) ||
            c.lecturerName?.toLowerCase().includes(s)
        );
      }
      if (levelFilter !== "all") {
        filtered = filtered.filter((c) => c.level === levelFilter);
      }
      setCourses(filtered);
    } else if (fetchedCourses) {
      setLoading(false);
      setCourses(fetchedCourses.results);
    }
  }, [useMockData, fetchedCourses, search, levelFilter]);

  const handleDelete = async (courseId: string) => {
    const success = await deleteCourse(courseId);
    if (success) {
      setCourses(courses.filter((c) => c.id !== courseId));
    }
  };

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      "100 Level": "bg-info/10 text-info border-info/20",
      "200 Level": "bg-primary/10 text-primary border-primary/20",
      "300 Level": "bg-success/10 text-success border-success/20",
      "400 Level": "bg-warning/10 text-warning border-warning/20",
    };
    return (
      <Badge className={colors[level] || "bg-muted text-muted-foreground"}>
        {level}
      </Badge>
    );
  };

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Course Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage courses, enrollments, and materials.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, code, or lecturer..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Level Filter */}
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="100 Level">100 Level</SelectItem>
                <SelectItem value="200 Level">200 Level</SelectItem>
                <SelectItem value="300 Level">300 Level</SelectItem>
                <SelectItem value="400 Level">400 Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Courses ({useMockData ? courses.length : fetchedCourses?.count || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading || apiLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No courses found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {courses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="h-full border-border hover:border-brand-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">
                              {course.code}
                            </span>
                            {getLevelBadge(course.level)}
                          </div>
                          <h3 className="font-semibold text-foreground truncate">
                            {course.title}
                          </h3>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Manage Enrollments
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(course.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students_enrolled} students
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {course.materials_count} materials
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(course.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {course.lecturerName && (
                          <span className="text-xs text-muted-foreground">
                            👤 {course.lecturerName}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {courses.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {courses.length} of{" "}
                {useMockData ? courses.length : fetchedCourses?.count || 0} courses
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">Page {page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={courses.length < 10}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}