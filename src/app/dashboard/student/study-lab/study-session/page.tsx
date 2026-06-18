"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Loader2, ExternalLink, ArrowLeft, FileText, X, Star,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import apiService from "@/services/apiService";
import type { ChatMessage } from "@/types/studylab";
import { UI_TEXT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useParams, useRouter, usePathname } from "next/navigation";
import type { Course } from "@/types/course";
import type { CourseMaterial } from "@/types/material";
import { useMaterials } from "@/hooks/useMaterials";

/* ── Question Block type ─────────────────────────────────────────── */
interface QuestionBlock {
  id: string;
  title: string;
  messageId: string;
}

function refineTitle(question: string): string {
  const cleaned = question.replace(/\?$/, "").trim();
  if (cleaned.length <= 40) return cleaned;
  return cleaned.slice(0, 40).replace(/\s+\S*$/, "") + "…";
}

/* ── Component ───────────────────────────────────────────────────── */
export default function StudySession() {
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const router = useRouter();
  const isNew = sessionId === "new";

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const { materials, loading: materialsLoading, refresh: refreshMaterials } = useMaterials(selectedCourse || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [questionBlocks, setQuestionBlocks] = useState<QuestionBlock[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  // PDF viewer
  const [pdfOpen, setPdfOpen] = useState(false);
  const [activePdf, setActivePdf] = useState<CourseMaterial | null>(null);

  // Feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackNote, setFeedbackNote] = useState("");
  const userQuestionCount = useRef(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  /* ── Data loading ────────────────────────────────────────────── */
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await apiService.courses.getMyCourses();
        setCourses(response.data);
        if (response.data.length) setSelectedCourse(response.data[0].id);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    void loadCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    setLoading(true);
    
    const loadSessionData = async () => {
      try {
        await refreshMaterials();
        
        // Only load messages if we have an existing session
        if (!isNew) {
          const messages = await apiService.studyLab.getSessionMessages(sessionId);
          setMessages(messages);
          const blocks: QuestionBlock[] = messages
            .filter((msg) => msg.role === "user")
            .map((msg) => ({ id: `qb-${msg.id}`, title: refineTitle(msg.content), messageId: msg.id }));
          setQuestionBlocks(blocks);
          userQuestionCount.current = blocks.length;
        } else {
          setMessages([]);
          setQuestionBlocks([]);
        }
      } catch {
        setMessages([]);
        setQuestionBlocks([]);
      } finally {
        setLoading(false);
      }
    };

    void loadSessionData();
  }, [selectedCourse, isNew, refreshMaterials, sessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Send message ────────────────────────────────────────────── */
  const handleSend = async () => {
    if (!input.trim() || sending) return;
    
    setSending(true);
    const userMessage = input;

    try {
      // Ask question and get response from real API
      const response = await apiService.studyLab.askQuestion(sessionId, userMessage);
      
      // Add both user and assistant messages to the UI
      setMessages((prev) => [...prev, response.user, response.assistant]);

      // Add user question to question blocks
      const newBlock: QuestionBlock = {
        id: `qb-${response.user.id}`,
        title: refineTitle(userMessage),
        messageId: response.user.id,
      };
      setQuestionBlocks((prev) => [...prev, newBlock]);
      userQuestionCount.current += 1;

      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally show error toast to user
    } finally {
      setSending(false);
    }

    if (userQuestionCount.current === 3 && !feedbackGiven) {
      setTimeout(() => setShowFeedback(true), 1200);
    }
  };

  /* ── Scroll to question ──────────────────────────────────────── */
  const scrollToMessage = useCallback((messageId: string) => {
    const el = messageRefs.current.get(messageId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  /* ── Open PDF viewer ─────────────────────────────────────────── */
  const openPdf = (materialName: string) => {
    const mat = materials.find((m) => (m.fileName ?? m.file_name) === materialName);
    if (mat) {
      setActivePdf(mat);
      setPdfOpen(true);
    }
  };

  /* ── Submit feedback ─────────────────────────────────────────── */
  const handleFeedbackSubmit = async () => {
    try {
      await apiService.studyLab.submitSessionFeedback(sessionId, {
        rating: feedbackRating,
        note: feedbackNote,
      });
      setFeedbackGiven(true);
      setShowFeedback(false);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      // Show error to user if needed
    }
  };

const pathname = usePathname();

const basePath = pathname.includes("/lecturer/")
  ? "/dashboard/lecturer"
  : "/dashboard/student";


  return (
    
    <div className="max-w-[1500px] h-[calc(100vh-7rem)] mx-auto px-8 py-8 flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(`${basePath}/study-lab`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {isNew ? "New Study Session" : "Study Session"}
            </h1>
            <p className="text-xs text-muted-foreground">{UI_TEXT.studyLab.subtitle}</p>
          </div>
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.code} - {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Three-column layout */}
      <div className="flex-1 flex gap-3 min-h-0">
        {/* LEFT: Question Blocks */}
        <div className="w-56 shrink-0 hidden lg:flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border bg-muted/30">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Questions
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {questionBlocks.length === 0 && !loading && (
                <p className="text-xs text-muted-foreground text-center mt-8 px-2">
                  Your questions will appear here as you ask them.
                </p>
              )}
              {questionBlocks.map((block, idx) => (
                <motion.button
                  key={block.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => scrollToMessage(block.messageId)}
                  className="w-full text-left p-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-accent/50 transition-all text-xs group"
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-3.5 w-3.5 mt-0.5 text-primary/60 shrink-0" />
                    <span className="text-foreground group-hover:text-primary transition-colors line-clamp-2 font-medium">
                      {block.title}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>
        </div>

        {/* CENTER: Chat */}
        <Card className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          pdfOpen && "lg:flex-[0.55]"
        )}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto text-center px-4 py-8 select-none">
                {/* Visual Icon with soft pulsing background glow */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative mb-6"
                >
                  <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-xl animate-pulse" />
                  <div className="relative h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg border border-primary/20">
                    <MessageSquare className="h-8 w-8 text-primary-foreground" />
                  </div>
                </motion.div>

                {/* Engaging large greeting heading */}
                <motion.h2 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                >
                  What do you want to study today?
                </motion.h2>

                {/* Supportive subtitle description */}
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm"
                >
                  Select a course and type your query below to get started. Our AI study assistant is ready to help you analyze and learn your materials.
                </motion.p>

                {/* Interactive suggestion cards for a fresh start */}
                <motion.div 
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg"
                >
                  {[
                    {
                      title: "Summarize slides",
                      description: "Get a high-level overview of key concepts.",
                      prompt: "Summarize the core concepts of this course and highlight the most important parts I need to know.",
                      icon: "📝"
                    },
                    {
                      title: "Quiz preparation",
                      description: "Generate practice questions with feedback.",
                      prompt: "Create a 5-question multiple choice quiz based on the course materials so I can test my knowledge.",
                      icon: "❓"
                    },
                    {
                      title: "Explain concepts",
                      description: "Break down complex topics into simple terms.",
                      prompt: "Explain the most challenging topics in this course in simple, easy-to-understand terms.",
                      icon: "🔍"
                    },
                    {
                      title: "Study strategy",
                      description: "Design a plan to master this course.",
                      prompt: "Help me design a personalized study plan to prepare for examinations in this course.",
                      icon: "📅"
                    }
                  ].map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInput(sug.prompt)}
                      className="text-left p-4 rounded-xl border border-border bg-card hover:bg-accent/40 hover:border-primary/40 transition-all duration-200 group relative overflow-hidden cursor-pointer"
                    >
                      <div className="flex gap-3">
                        <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">{sug.icon}</span>
                        <div>
                          <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                            {sug.title}
                          </h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                            {sug.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  ref={(el) => {
                    if (el) messageRefs.current.set(msg.id, el);
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-xl px-4 py-3",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {/* Source citations */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 space-y-1.5 border-t border-border/30 pt-2">
                          {msg.sources.map((src, i) => {
                            const materialName = src.material?.fileName ?? src.material?.file_name ?? "Document";
                            return (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const name = src.material?.fileName ?? src.material?.file_name;
                                  if (name) {
                                    openPdf(name);
                                  }
                                }}
                                className="w-full flex items-start gap-2 text-xs bg-background/50 rounded-md p-2 cursor-pointer hover:bg-background/80 transition-colors text-left"
                              >
                                <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                                <div>
                                  <span className="font-medium">
                                    {UI_TEXT.studyLab.sourceTag}: {materialName}
                                  </span>
                                  <span className="ml-2 text-muted-foreground">
                                    ({UI_TEXT.studyLab.pageRef} {src.page})
                                  </span>
                                  <p className="text-muted-foreground mt-0.5 italic">
                                    &quot;{src.snippet}&quot;
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))
            )}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {UI_TEXT.studyLab.aiThinking}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={UI_TEXT.studyLab.askPlaceholder}
                disabled={sending}
                className="flex-1"
              />
              <Button type="submit" size="icon" variant="hero" disabled={sending || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>

        {/* RIGHT: Material References (always visible) */}
        <div className={cn(
          "w-52 shrink-0 hidden lg:flex flex-col transition-all duration-300",
          pdfOpen && "w-0 overflow-hidden opacity-0 lg:hidden"
        )}>
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border bg-muted/30">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Materials
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {loading || materialsLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
              ) : materials.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center mt-8">No materials available</p>
              ) : (
                materials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => {
                      setActivePdf(mat);
                      setPdfOpen(true);
                    }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-accent/50 transition-all text-left"
                  >
                    <FileText className="h-4 w-4 text-primary/60 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{mat.fileName ?? mat.file_name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {mat.pageCount ?? mat.page_count ?? 0} pages
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT: PDF Viewer (slides in) */}
        <AnimatePresence>
          {pdfOpen && activePdf && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "40%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="hidden lg:flex flex-col overflow-hidden"
            >
              <Card className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs font-medium text-foreground truncate">
                      {activePdf.file_name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                      setPdfOpen(false);
                      setActivePdf(null);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex-1 flex items-center justify-center bg-muted/20 p-4">
                  <div className="text-center space-y-3">
                    <div className="h-20 w-16 mx-auto rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{activePdf.fileName ?? activePdf.file_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activePdf.pageCount ?? activePdf.page_count ?? 0} pages • {(((activePdf.fileSize ?? activePdf.file_size ?? 0) / 1024 / 1024).toFixed(1))} MB
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      PDF viewer would render here
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Feedback Dialog ──────────────────────────────────────── */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How&apos;s your study experience?</DialogTitle>
            <DialogDescription>
              Your feedback helps us improve the AI study assistant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Star Rating */}
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      star <= feedbackRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
            {/* Optional note */}
            <Textarea
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              placeholder="Any additional thoughts? (optional)"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowFeedback(false)}>
              Skip
            </Button>
            <Button variant="hero" onClick={handleFeedbackSubmit} disabled={feedbackRating === 0}>
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
