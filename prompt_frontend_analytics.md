# Copilot Prompt — Acadexis Frontend: Analytics / Heatmap

---

## Context

This is the **Next.js** frontend (React 19, TypeScript, Zustand, Axios, Tailwind) for **Acadexis**. Auth, user/profile, courses, materials, study lab, and notifications are already fixed from previous prompts. This prompt covers everything related to **analytics and the struggle heatmap** — the service functions, TypeScript types, data hook, the lecturer dashboard heatmap panel, and the visual heatmap component.

Files in scope:
- `src/services/apiService.ts` — analytics service functions
- `src/types/analytics.ts` — TypeScript types (create if it doesn't exist)
- `src/hooks/useHeatmap.ts` — data fetching hook
- `src/app/dashboard/lecturer/page.tsx` — lecturer dashboard (primary heatmap consumer)
- Any heatmap chart or visualization component

The Axios base URL is already `http://localhost:8000/api`. All paths below are relative to that base.

---

## Critical conflicts to resolve first

The frontend mock contract (`api.ts`) used **camelCase** field names:
- `questionsAsked`
- `avgConfidence`
- `strugglingStudents`

The real backend returns **both** snake_case and camelCase aliases for all three fields:
- `questions_asked` + `questionsAsked`
- `avg_confidence` + `avgConfidence`
- `struggling_students` + `strugglingStudents`

The old endpoint path was:
- `GET /analytics/heatmap?courseId=<id>`

The real backend serves it at:
- `GET /heatmap/?course=<uuid>`

Two changes: the path (`/analytics/heatmap` → `/heatmap/`) and the query param name (`courseId` → `course`).

---

## Fix 1: Add TypeScript types in `src/types/analytics.ts`

```typescript
// src/types/analytics.ts

export interface TopicStruggle {
  id:     string;
  course: string;   // Course UUID

  topic: string;

  // snake_case — canonical backend fields
  questions_asked:     number;
  avg_confidence:      number;   // 0.0 – 1.0 (never a percentage)
  struggling_students: number;

  // camelCase aliases — also present in the backend response for backward compat
  questionsAsked?:     number;
  avgConfidence?:      number;
  strugglingStudents?: number;

  updated_at: string;
}

// Derived UI type — used for rendering the heatmap chart
export interface HeatmapCell {
  topic:               string;
  questionsAsked:      number;
  avgConfidence:       number;   // 0.0 – 1.0
  strugglingStudents:  number;
  // Computed color intensity for heat display: 0 (cool) → 1 (hot)
  // Based on inverse of avgConfidence: lower confidence = hotter
  heatIntensity:       number;
}
```

---

## Fix 2: Fix the endpoint path and query param in `apiService.ts`

```typescript
// src/services/apiService.ts — analytics functions

import { TopicStruggle } from "@/types/analytics";
import { PaginatedResponse } from "@/types/course";

export const getHeatmap = async (params?: {
  course?:   string;    // Course UUID — NOT courseId
  ordering?: string;    // e.g. "-questions_asked"
  search?:   string;    // Filter by topic name
  page?:     number;
}): Promise<PaginatedResponse<TopicStruggle>> => {
  // Correct path: /heatmap/  (not /analytics/heatmap)
  // Correct param: course    (not courseId)
  const response = await apiClient.get<PaginatedResponse<TopicStruggle>>(
    "/heatmap/",
    { params }
  );
  return response.data;
};
```

The two things that changed from the mock:
1. Path: `/analytics/heatmap` → `/heatmap/`
2. Query param: `courseId` → `course`

---

## Fix 3: Create `src/hooks/useHeatmap.ts`

```typescript
// src/hooks/useHeatmap.ts
import { useState, useEffect, useCallback } from "react";
import { getHeatmap } from "@/services/apiService";
import { TopicStruggle, HeatmapCell } from "@/types/analytics";

interface UseHeatmapOptions {
  courseId?: string;    // If provided, fetch for a specific course
  autoFetch?: boolean;  // Default true
}

export const useHeatmap = ({ courseId, autoFetch = true }: UseHeatmapOptions = {}) => {
  const [data,      setData]      = useState<TopicStruggle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const fetch = useCallback(async (course?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use provided course or the hook's courseId option
      const params = { course: course ?? courseId, ordering: "-questions_asked" };
      const response = await getHeatmap(params);
      setData(response.results);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        setError("Heatmap analytics are only available to lecturers.");
      } else {
        setError("Failed to load heatmap data.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  // Derive HeatmapCell array for the chart — normalise and compute heat intensity
  const cells: HeatmapCell[] = data.map((item) => {
    // Prefer snake_case canonical field; fall back to camelCase alias
    const questionsAsked     = item.questions_asked     ?? item.questionsAsked     ?? 0;
    const avgConfidence      = item.avg_confidence      ?? item.avgConfidence      ?? 0;
    const strugglingStudents = item.struggling_students ?? item.strugglingStudents ?? 0;

    return {
      topic:               item.topic,
      questionsAsked,
      avgConfidence,
      strugglingStudents,
      // Heat intensity: low confidence = high heat
      // Clamp to 0–1 range
      heatIntensity: Math.min(1, Math.max(0, 1 - avgConfidence)),
    };
  });

  // Sort by heat intensity descending for visual impact
  const sortedCells = [...cells].sort((a, b) => b.heatIntensity - a.heatIntensity);

  useEffect(() => {
    if (autoFetch) fetch();
  }, [courseId, autoFetch]);

  return {
    data,           // Raw TopicStruggle records
    cells: sortedCells,  // Derived HeatmapCell array for charts
    isLoading,
    error,
    refetch: fetch,
  };
};
```

---

## Fix 4: Fix the lecturer dashboard page

Open `src/app/dashboard/lecturer/page.tsx`. This page shows courses and the heatmap. Fix the heatmap data fetching — replace any old mock call with the real hook and correct path:

```typescript
// src/app/dashboard/lecturer/page.tsx
"use client";

import { useState } from "react";
import { useCourses }  from "@/hooks/useCourses";
import { useHeatmap }  from "@/hooks/useHeatmap";

export default function LecturerDashboardPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  // Courses the lecturer teaches (role-aware endpoint)
  const { courses, isLoading: coursesLoading } = useCourses({ mode: "mine" });

  // Heatmap data — re-fetches automatically when selectedCourseId changes
  const { cells, isLoading: heatmapLoading, error: heatmapError } =
    useHeatmap({ courseId: selectedCourseId });

  // Auto-select first course on load
  if (courses.length > 0 && !selectedCourseId) {
    setSelectedCourseId(courses[0].id);
  }

  return (
    <div>
      {/* Course selector */}
      <select
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(e.target.value)}
        disabled={coursesLoading}
      >
        <option value="">All courses</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.code} — {c.title}
          </option>
        ))}
      </select>

      {/* Heatmap */}
      {heatmapLoading ? (
        <div>Loading analytics...</div>
      ) : heatmapError ? (
        <div>{heatmapError}</div>
      ) : cells.length === 0 ? (
        <div>
          No analytics data yet. Data appears as students ask questions in the study lab.
        </div>
      ) : (
        <HeatmapChart cells={cells} />
      )}
    </div>
  );
}
```

---

## Fix 5: Build the `HeatmapChart` component

Create `src/components/HeatmapChart.tsx`. This component visualises the `HeatmapCell` array as a grid where colour intensity reflects how much students are struggling with each topic:

```typescript
// src/components/HeatmapChart.tsx
"use client";

import { HeatmapCell } from "@/types/analytics";

interface Props {
  cells: HeatmapCell[];
}

export function HeatmapChart({ cells }: Props) {
  if (cells.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <span>Cool (high confidence)</span>
        <div className="flex gap-1">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
            <div
              key={v}
              className="w-6 h-4 rounded"
              style={{ backgroundColor: getHeatColor(v) }}
            />
          ))}
        </div>
        <span>Hot (struggling)</span>
      </div>

      <div className="grid gap-2">
        {cells.map((cell) => (
          <HeatmapRow key={cell.topic} cell={cell} />
        ))}
      </div>
    </div>
  );
}

function HeatmapRow({ cell }: { cell: HeatmapCell }) {
  const bgColor    = getHeatColor(cell.heatIntensity);
  const textColor  = cell.heatIntensity > 0.6 ? "#fff" : "#1a1a1a";
  const confidence = Math.round(cell.avgConfidence * 100);

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg transition-all"
      style={{ backgroundColor: bgColor }}
    >
      {/* Topic name */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate" style={{ color: textColor }}>
          {cell.topic}
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 shrink-0 text-xs" style={{ color: textColor }}>
        <div className="text-center">
          <p className="font-semibold">{cell.questionsAsked}</p>
          <p className="opacity-75">questions</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{confidence}%</p>
          <p className="opacity-75">confidence</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{cell.strugglingStudents}</p>
          <p className="opacity-75">struggling</p>
        </div>
      </div>

      {/* Heat bar */}
      <div className="w-24 shrink-0">
        <div className="h-2 rounded-full bg-white/30">
          <div
            className="h-2 rounded-full bg-white/80 transition-all"
            style={{ width: `${cell.heatIntensity * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Maps a heat intensity value (0.0–1.0) to a colour.
 * 0.0 = cool blue (high confidence, no struggle)
 * 1.0 = hot red (low confidence, high struggle)
 */
function getHeatColor(intensity: number): string {
  // Interpolate from blue → yellow → red
  const clamped = Math.min(1, Math.max(0, intensity));
  if (clamped < 0.5) {
    // Blue (#3B82F6) → Yellow (#EAB308)
    const t  = clamped * 2;
    const r  = Math.round(59  + (234 - 59)  * t);
    const g  = Math.round(130 + (179 - 130) * t);
    const b  = Math.round(246 + (8   - 246) * t);
    return `rgb(${r},${g},${b})`;
  } else {
    // Yellow (#EAB308) → Red (#EF4444)
    const t  = (clamped - 0.5) * 2;
    const r  = Math.round(234 + (239 - 234) * t);
    const g  = Math.round(179 + (68  - 179) * t);
    const b  = Math.round(8   + (68  - 8)   * t);
    return `rgb(${r},${g},${b})`;
  }
}
```

---

## Fix 6: Add a summary stats row above the heatmap

Display aggregated stats from the heatmap cells to give the lecturer a quick overview before drilling into topic-level detail:

```typescript
// src/components/HeatmapSummary.tsx
"use client";

import { HeatmapCell } from "@/types/analytics";

interface Props {
  cells: HeatmapCell[];
}

export function HeatmapSummary({ cells }: Props) {
  if (cells.length === 0) return null;

  const totalQuestions    = cells.reduce((s, c) => s + c.questionsAsked, 0);
  const avgConfidenceAll  = cells.reduce((s, c) => s + c.avgConfidence, 0) / cells.length;
  const totalStruggling   = cells.reduce((s, c) => s + c.strugglingStudents, 0);
  const hottestTopic      = cells[0]?.topic ?? "—";  // Already sorted by heat intensity

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Total Questions"
        value={totalQuestions.toString()}
        sub="across all topics"
      />
      <StatCard
        label="Avg Confidence"
        value={`${Math.round(avgConfidenceAll * 100)}%`}
        sub="class average"
      />
      <StatCard
        label="Struggling Students"
        value={totalStruggling.toString()}
        sub="< 50% confidence"
      />
      <StatCard
        label="Hottest Topic"
        value={hottestTopic}
        sub="most struggle"
        truncate
      />
    </div>
  );
}

function StatCard({
  label, value, sub, truncate = false,
}: {
  label: string; value: string; sub: string; truncate?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-semibold text-gray-900 ${truncate ? "truncate" : ""}`}>
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}
```

Use it in the lecturer dashboard above the `HeatmapChart`:

```tsx
<HeatmapSummary cells={cells} />
<HeatmapChart   cells={cells} />
```

---

## Fix 7: Fix all camelCase field references in existing code

Search the codebase for any existing analytics-related code that reads from the mock API response. Update every field reference:

| Old reference (wrong) | Correct reference |
|---|---|
| `item.questionsAsked` | `item.questions_asked` (prefer) or `item.questionsAsked` (alias, also works) |
| `item.avgConfidence` | `item.avg_confidence` (prefer) or `item.avgConfidence` (alias, also works) |
| `item.strugglingStudents` | `item.struggling_students` (prefer) or `item.strugglingStudents` (alias, also works) |

For **all new code** use the snake_case versions. The camelCase aliases exist only for backward compatibility with old mock references that haven't been cleaned up yet.

---

## Fix 8: Display `avgConfidence` as a percentage in the UI

The backend returns `avg_confidence` as a ratio (`0.0–1.0`). **Never display the raw value directly** — always multiply by 100 for display:

```typescript
// WRONG — shows "0.62" to the user
<span>{item.avg_confidence}</span>

// CORRECT — shows "62%"
<span>{Math.round(item.avg_confidence * 100)}%</span>

// Also correct using the hook's derived cell
<span>{Math.round(cell.avgConfidence * 100)}%</span>
```

This applies everywhere: stats cards, tooltips, table cells, and chart labels.

---

## Fix 9: Handle the 403 response for students

If a student somehow navigates to a page that calls the heatmap endpoint, the backend returns `403 Forbidden`. The `useHeatmap` hook already handles this with a specific error message. Make sure any component consuming the hook renders this gracefully:

```tsx
{error && (
  <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-lg">
    {error}
  </div>
)}
```

Do not show an error toast or modal for this — it is an expected, non-critical state for student-role users who should not see this panel.

---

## Fix 10: Show empty state when no sessions have been created yet

When a course has no study sessions, the heatmap table will be empty. Show a helpful empty state that guides the lecturer:

```tsx
{cells.length === 0 && !isLoading && !error && (
  <div className="text-center py-12 text-gray-400">
    <p className="text-lg mb-2">No analytics data yet</p>
    <p className="text-sm">
      Data will appear here as students ask questions in the study lab.
      Make sure your course materials have been uploaded and processed.
    </p>
  </div>
)}
```

---

## General Rules

- Do not change any UI layouts, Tailwind classes, or component visual structure beyond what is listed in the fixes above.
- Always read `avg_confidence` as a `0.0–1.0` ratio and multiply by 100 for display. Never treat it as a percentage stored in the DB.
- Prefer `questions_asked`, `avg_confidence`, and `struggling_students` (snake_case) in all new code. The camelCase aliases exist only for backward compatibility.
- The endpoint is `/heatmap/` (not `/analytics/heatmap`). The query param is `course` (not `courseId`).
- Only render the heatmap on the lecturer dashboard. Do not render analytics components on any student-facing page.
- The `useHeatmap` hook automatically re-fetches when `courseId` changes — do not add manual re-fetch calls on course selection change; just update `courseId` in the state.
