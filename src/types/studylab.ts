export interface MessageSource {
  id: string;
  message: string; // ChatMessage UUID
  material:
    | {
        id: string;
        file_name: string;
        fileName?: string;
        file: string;
        course: string;
      }
    | null;
  page: number;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  session: string;
  role: "user" | "assistant";
  content: string;
  sources: MessageSource[];
  created_at: string;
  timestamp: string;
}

export interface AskResponse {
  user: ChatMessage;
  assistant: ChatMessage;
}

export interface StudySession {
  id: string;
  user: string;
  course: string;
  title: string;
  description: string;
  confidence_score: number;
  confidenceScore?: number;
  created_at: string;
  createdAt?: string;
  updated_at: string;
  updatedAt?: string;
}

export interface SessionFeedbackPayload {
  rating: number;
  note?: string;
}

export interface Bookmark {
  id: string;
  kind: "snippet" | "answer";
  title: string;
  content: string;
  material: string | null;
  page: number | null;
  message: string | null;
  created_at: string;
}
