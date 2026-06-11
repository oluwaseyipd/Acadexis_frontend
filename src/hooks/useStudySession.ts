import { useCallback, useEffect, useRef, useState } from "react";
import apiService from "@/services/apiService";
import type { AskResponse, ChatMessage, StudySession } from "@/types/studylab";

interface UseStudySessionOptions {
  courseId: string;
  sessionId?: string;
}

export const useStudySession = ({ courseId, sessionId }: UseStudySessionOptions) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    setError(null);
    try {
      const data = courseId
        ? await apiService.studyLab.getSessionsForCourse(courseId)
        : await apiService.studyLab.getAllSessions();
      setSessions(data);
      return data;
    } catch (err) {
      setError("Failed to load sessions.");
      return [] as StudySession[];
    } finally {
      setIsLoadingSessions(false);
    }
  }, [courseId]);

  const loadHistory = useCallback(async (session: StudySession) => {
    setActiveSession(session);
    setIsLoadingHistory(true);
    setMessages([]);
    setError(null);

    try {
      const history = await apiService.studyLab.getSessionMessages(session.id);
      setMessages(history);
    } catch {
      setError("Failed to load chat history.");
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const startNewSession = useCallback(
    async (title?: string) => {
      if (!courseId) {
        setError("Please select a course before starting a study session.");
        return null;
      }

      try {
        const session = await apiService.studyLab.createSession({
          course: courseId,
          title: title ?? "New Session",
        });
        setSessions((prev) => [session, ...prev]);
        setActiveSession(session);
        setMessages([]);
        return session;
      } catch {
        setError("Failed to create session.");
        return null;
      }
    },
    [courseId]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!activeSession || !text.trim() || isAsking) return;

      const optimisticUserMsg: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        session: activeSession.id,
        role: "user",
        content: text.trim(),
        sources: [],
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticUserMsg]);
      setIsAsking(true);
      setError(null);

      try {
        const response = await apiService.studyLab.askQuestion(activeSession.id, text.trim());
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== optimisticUserMsg.id),
          response.user,
          response.assistant,
        ]);
      } catch (err: unknown) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMsg.id));
        const errWithResponse = err as { response?: { data?: { detail?: string } } };
        const detail = errWithResponse?.response?.data?.detail ?? "";
        if (typeof detail === "string" && detail.toLowerCase().includes("no processed materials")) {
          setError(
            "This course has no processed materials yet. Your lecturer needs to upload and process course content before you can ask questions."
          );
        } else {
          setError(detail || "Failed to get a response. Please try again.");
        }
      } finally {
        setIsAsking(false);
      }
    },
    [activeSession, isAsking]
  );

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      const data = await loadSessions();
      if (!isMounted) return;

      if (sessionId) {
        const found = data.find((s) => s.id === sessionId);
        if (found) {
          await loadHistory(found);
          return;
        }

        try {
          const session = await apiService.studyLab.getSessionById(sessionId);
          if (isMounted) {
            await loadHistory(session);
          }
        } catch {
          if (isMounted) {
            setError("Failed to load the requested session.");
          }
        }
      } else if (data.length > 0) {
        await loadHistory(data[0]);
      }
    };

    if (courseId || sessionId) {
      void initialize();
    }

    return () => {
      isMounted = false;
    };
  }, [courseId, loadSessions, loadHistory, sessionId]);

  return {
    sessions,
    activeSession,
    messages,
    isLoadingSessions,
    isLoadingHistory,
    isAsking,
    error,
    messagesEndRef,
    loadSessions,
    loadHistory,
    startNewSession,
    sendMessage,
    setError,
  };
};
