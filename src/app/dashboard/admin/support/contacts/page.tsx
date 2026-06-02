"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Search,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  MailOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useContactMessages } from "@/hooks/useAdmin";
import type { ContactMessage } from "@/types/admin";
import { UI_TEXT } from "@/lib/constants";

// Mock data for demonstration
const mockMessages: ContactMessage[] = [
  {
    id: "cm1",
    user: "u1",
    userName: "John Abiola",
    subject: "Question about course materials",
    body: "Hi, I wanted to ask if there's a way to download all course materials at once instead of individually? This would really help with offline studying.",
    email: "john.student@university.edu",
    created_at: "2026-03-11T10:30:00Z",
  },
  {
    id: "cm2",
    user: "u2",
    userName: "Mary Jane",
    subject: "Feature request - Dark mode",
    body: "Would love to see a dark mode option for the Study Lab. Sometimes I study at night and the bright interface is hard on the eyes.",
    email: "mary.jane@university.edu",
    created_at: "2026-03-10T14:20:00Z",
  },
  {
    id: "cm3",
    user: null,
    userName: "Visitor",
    subject: "Partnership inquiry",
    body: "Hello, I represent a tech education startup and we'd like to explore potential partnership opportunities with Acadexis. Who should we contact?",
    email: "partnership@startup.com",
    created_at: "2026-03-09T09:00:00Z",
  },
  {
    id: "cm4",
    user: "u3",
    userName: "James Smith",
    subject: "Login issue",
    body: "I keep getting logged out unexpectedly. Is there a session timeout setting I should be aware of?",
    email: "james.smith@university.edu",
    created_at: "2026-03-08T16:45:00Z",
  },
];

export default function AdminContactsPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  const { messages: fetchedMessages, loading: apiLoading, error, refetch } = useContactMessages();

  useEffect(() => {
    if (error || (!apiLoading && !fetchedMessages)) {
      setUseMockData(true);
    }
  }, [error, apiLoading, fetchedMessages]);

  useEffect(() => {
    if (useMockData) {
      setLoading(false);
      setMessages(mockMessages);
    } else if (fetchedMessages) {
      setLoading(false);
      setMessages(fetchedMessages);
    }
  }, [useMockData, fetchedMessages]);

  const filteredMessages = messages.filter(
    (m) =>
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.body.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-muted-foreground mt-1">
            View and manage inquiries from users and visitors.
          </p>
        </div>
        <Badge variant="outline" className="self-start">
          {filteredMessages.length} messages
        </Badge>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading || apiLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No messages found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((message, i) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  {/* Message Header */}
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === message.id ? null : message.id)
                    }
                    className="w-full flex items-start gap-4 p-4 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">
                          {message.userName || "Anonymous"}
                        </span>
                        {message.user && (
                          <Badge variant="secondary" className="text-xs">
                            Registered User
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">
                        {message.subject}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                      {expandedId === message.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Message Body (Expanded) */}
                  {expandedId === message.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-4 pb-4 pt-0 border-t border-border"
                    >
                      <div className="pt-4">
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {message.body}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <a
                            href={`mailto:${message.email}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
                          >
                            <Mail className="h-4 w-4" />
                            Reply
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}