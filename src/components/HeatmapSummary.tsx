"use client";

import { HeatmapCell } from "@/types/analytics";

interface Props {
  cells: HeatmapCell[];
}

export function HeatmapSummary({ cells }: Props) {
  if (cells.length === 0) return null;

  const totalQuestions = cells.reduce((sum, cell) => sum + cell.questionsAsked, 0);
  const avgConfidenceAll = cells.reduce((sum, cell) => sum + cell.avgConfidence, 0) / cells.length;
  const totalStruggling = cells.reduce((sum, cell) => sum + cell.strugglingStudents, 0);
  const hottestTopic = cells[0]?.topic ?? "—";

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Questions" value={totalQuestions.toString()} sub="across all topics" />
      <StatCard label="Avg Confidence" value={`${Math.round(avgConfidenceAll * 100)}%`} sub="class average" />
      <StatCard label="Struggling Students" value={totalStruggling.toString()} sub="based on hot topics" />
      <StatCard label="Hottest Topic" value={hottestTopic} sub="most at-risk area" truncate />
    </div>
  );
}

function StatCard({ label, value, sub, truncate = false }: { label: string; value: string; sub: string; truncate?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-semibold text-foreground ${truncate ? "truncate" : ""}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}
