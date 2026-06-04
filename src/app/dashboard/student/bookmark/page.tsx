"use client";

import { useEffect, useState } from "react";
import { Bookmark, FileText, MessageSquare, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import apiService from "@/services/apiService";
import type { Bookmark as BookmarkType } from "@/types/studylab";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.studyLab.getBookmarks();
        setBookmarks(data || []);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
        setError("Failed to load bookmarks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bookmarks</h1>
        <p className="text-muted-foreground text-sm mt-1">Quick access to bookmarked PDF snippets and AI answers.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Bookmark className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No bookmarks yet. Save snippets from your study sessions!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((bm) => (
            <Card key={bm.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex gap-4">
                <div className="shrink-0 h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  {bm.kind === "snippet" ? <FileText className="h-5 w-5 text-muted-foreground" /> : <MessageSquare className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">{bm.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{bm.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
