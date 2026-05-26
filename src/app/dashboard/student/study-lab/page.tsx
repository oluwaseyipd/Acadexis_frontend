"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, BookOpen, FileText, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { UI_TEXT } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface StudySession {
  id: string;
  title: string;
  description: string;
  courseTitle: string;
  courseCode: string;
  referencedDocs: string[];
  date: string;
  confidenceLevel: number;
  questionCount: number;
}

const mockStudySessions: StudySession[] = [
  {
    id: "ss1",
    title: "Understanding Backpropagation",
    description: "Explored the fundamentals of backpropagation in neural networks, including gradient computation and the chain rule.",
    courseTitle: "Introduction to Machine Learning",
    courseCode: "CSC3022F",
    referencedDocs: ["Lecture 8 - Neural Networks.pdf", "Tutorial 4 - Gradient Descent.pdf", "Lab Manual - Week 9.pdf"],
    date: "2026-03-11T10:00:00Z",
    confidenceLevel: 72,
    questionCount: 5,
  },
  {
    id: "ss2",
    title: "Eigenvalues & Diagonalization",
    description: "Deep dive into eigenvalue decomposition, characteristic polynomials, and matrix diagonalization techniques.",
    courseTitle: "Linear Algebra",
    courseCode: "MAM1020F",
    referencedDocs: ["Chapter 5 - Eigenvalues.pdf", "Practice Set 3.pdf", "Supplementary Notes.pdf"],
    date: "2026-03-10T14:30:00Z",
    confidenceLevel: 58,
    questionCount: 8,
  },
  {
    id: "ss3",
    title: "Binary Search Trees & AVL Trees",
    description: "Studied self-balancing BSTs, rotations, and time complexity analysis for insertion and deletion.",
    courseTitle: "Data Structures & Algorithms",
    courseCode: "CSC2001F",
    referencedDocs: ["Lecture 6 - Trees.pdf", "Tutorial 5 - BST.pdf"],
    date: "2026-03-09T09:15:00Z",
    confidenceLevel: 85,
    questionCount: 3,
  },
  {
    id: "ss4",
    title: "Wave-Particle Duality",
    description: "Explored the double-slit experiment, de Broglie wavelength, and photoelectric effect interpretations.",
    courseTitle: "Quantum Mechanics I",
    courseCode: "PHY2014F",
    referencedDocs: ["Chapter 1 - Foundations.pdf", "Feynman Lectures Extract.pdf", "Problem Set 2.pdf"],
    date: "2026-03-08T16:00:00Z",
    confidenceLevel: 45,
    questionCount: 12,
  },
];

function getConfidenceColor(level: number) {
  if (level >= 75) return "text-green-500";
  if (level >= 50) return "text-yellow-500";
  return "text-red-500";
}

function getConfidenceBg(level: number) {
  if (level >= 75) return "bg-green-500/10";
  if (level >= 50) return "bg-yellow-500/10";
  return "bg-red-500/10";
}

export default function StudyLab() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSessions(mockStudySessions);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{UI_TEXT.studyLab.title}</h1>
          <p className="text-sm text-muted-foreground">{UI_TEXT.studyLab.subtitle}</p>
        </div>
        <Button variant="hero" onClick={() => router.push("/dashboard/student/study-lab/study-session/new")} className="gap-2">
          <Plus className="h-4 w-4" /> New Study
        </Button>
      </div>

      {/* Session Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))
          : sessions.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                  onClick={() => router.push(`/dashboard/student/study-lab/study-session/${session.id}`)}
                >
                  <div className="p-5 space-y-4">
                    {/* Title & Description */}
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {session.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {session.description}
                      </p>
                    </div>

                    {/* Course badge */}
                    <Badge variant="secondary" className="text-xs">
                      <BookOpen className="h-3 w-3 mr-1" /> {session.courseCode} - {session.courseTitle}
                    </Badge>

                    {/* Referenced Docs */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Referenced Materials</span>
                      <div className="space-y-1">
                        {session.referencedDocs.slice(0, 3).map((doc, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                            <FileText className="h-3 w-3 text-primary/60 shrink-0" />
                            <span className="truncate">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer: Date & Confidence */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /> {formatDate(session.date)}
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full",
                          getConfidenceBg(session.confidenceLevel),
                          getConfidenceColor(session.confidenceLevel)
                        )}
                      >
                        <TrendingUp className="h-3 w-3" /> {session.confidenceLevel}%
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
