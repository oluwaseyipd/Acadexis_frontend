"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, FileText, Trash2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";




const coursesStat=[
  { label: "Total Courses", value: 0, icon: BookOpen }, 
  { label: "Students Enrolled", value: 0, icon: Users },
  { label: "Published", value: 0, icon: FileText }, 
  { label: "Draft", value: 0 , icon: Trash2}]
  ;


// Mock "my courses" — subset the user has added
const myCoursesMock = [
  {
    id: "c1", title: "Introduction to Machine Learning", code: "CSC3022F", status: "Published",
    description: "Fundamentals of supervised and unsupervised learning, neural networks, and practical applications.",
    lecturerName: "Prof. Sarah Chen", materialsCount: 12, studentsEnrolled: 145,
  },
  {
    id: "c3", title: "Linear Algebra", code: "MAM1020F", status: "Draft",
    description: "Vector spaces, matrices, eigenvalues, and applications in data science.",
    lecturerName: "Dr. James Moyo", materialsCount: 15, studentsEnrolled: 320,
  },
  {
    id: "c4", title: "Data Structures and Algorithms", code: "CSC2001F", status: "Published",
    description: "Design and analysis of algorithms, data structures, and their applications.",
    lecturerName: "Prof. Michael De Beer", materialsCount: 18, studentsEnrolled: 280,
  }
];

export default function CoursesPage() {
  const [courses, setCourses] = useState(myCoursesMock);
  const { user } = useAppStore();

  const removeCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    // A grid display of courses with cards showing course name, description, and progress
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
        <p className="text-muted-foreground">Courses you have added to your study plan</p>
      </div>

      {/* Create New Course Button */}
      <Button  className="mt-4 bg-brand-primary text-brand-muted hover:bg-brand-primary/90">
        <PlusCircle className="h-4 w-4" />
        <Link href="/dashboard/lecturer/add-course">Create Course</Link>
      </Button>

    </div>
      

      {courses.length === 0 ? (
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 md:mt-10">

        {/* Stat Cards */}
        <div className="col-span-full grid grid-cols-2 lg:grid-cols-4 gap-4">
          {coursesStat.map((stat) => (
            <Card key={stat.label} className="relative shadow-card">
              <span className="absolute left-0 w-1.5 h-full rounded-l-lg bg-brand-primary transition-opacity duration-150"></span>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-brand-muted uppercase font-medium">{stat.label}</p>
                  <p className="text-lg md:text-4xl font-medium text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>



          {courses.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="mt-5 md:mt-10">
              <Card className="shadow-card hover:shadow-card-hover transition-shadow h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{course.code}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs ?${course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                      {course.status}
                    </Badge>
                  </div>
                  <Link href={`/dashboard/student/library/${course.id}`}>
                    <CardTitle className="text-base mt-2 hover:text-primary transition-colors cursor-pointer">{course.title}</CardTitle>
                  </Link>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{course.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-brand-muted">
                      <span>{course.lecturerName}</span>
                      <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{course.materialsCount}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.studentsEnrolled} Students</span>
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
