"use client";

import { useState, useEffect } from "react";
import { Users, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import apiService from "@/services/apiService";

interface EnrolledStudent {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  course_title: string;
  course_code: string;
  created_at: string;
}

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First get lecturer's courses
        const coursesResponse = await apiService.courses.getMyCourses();
        setCourses(coursesResponse.data || []);

        // If there are courses, get students from the first one
        if (coursesResponse.data && coursesResponse.data.length > 0) {
          const firstCourseId = coursesResponse.data[0].id;
          setSelectedCourse(firstCourseId);
          const studentsResponse = await apiService.courses.getStudents(firstCourseId);
          setStudents(studentsResponse.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId);
    if (!courseId) {
      setStudents([]);
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.courses.getStudents(courseId);
      setStudents(response.data || []);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Students</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage enrollment and monitor student activity across your courses.
        </p>
      </div>

      {/* Course Selector */}
      {courses.length > 0 && (
        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium">Select Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="px-3 py-2 rounded-md border bg-background text-sm"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" /> Enrolled Students
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">{error}</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No students enrolled in this course yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Course</TableHead>
                    <TableHead>Enrolled Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{s.student_name}</p>
                          <p className="text-xs text-muted-foreground sm:hidden mt-0.5">
                            {s.student_email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                        {s.student_email}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {s.course_code}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {new Date(s.created_at).toLocaleDateString()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}