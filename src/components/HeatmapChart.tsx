"use client";

import { HeatmapCell } from "@/types/analytics";

interface Props {
  cells: HeatmapCell[];
}

export function HeatmapChart({ cells }: Props) {
  if (cells.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
        <span>Cool (high confidence)</span>
        <div className="flex gap-1">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((value) => (
            <div
              key={value}
              className="w-6 h-4 rounded"
              style={{ backgroundColor: getHeatColor(value) }}
            />
          ))}
        </div>
        <span>Hot (struggling)</span>
      </div>

      <div className="grid gap-3">
        {cells.map((cell) => (
          <HeatmapRow key={cell.topic} cell={cell} />
        ))}
      </div>
    </div>
  );
}

function HeatmapRow({ cell }: { cell: HeatmapCell }) {
  const bgColor = getHeatColor(cell.heatIntensity);
  const textColor = cell.heatIntensity > 0.6 ? "#ffffff" : "#0f172a";
  const confidence = Math.round(cell.avgConfidence * 100);

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border border-border"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate" style={{ color: textColor }}>
          {cell.topic}
        </p>
      </div>
      <div className="flex flex-wrap gap-4 text-xs font-medium" style={{ color: textColor }}>
        <Stat label="Questions" value={cell.questionsAsked.toString()} />
        <Stat label="Confidence" value={`${confidence}%`} />
        <Stat label="Struggling" value={cell.strugglingStudents.toString()} />
      </div>
      <div className="w-full sm:w-28">
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[90px]">
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-[11px] opacity-80">{label}</p>
    </div>
  );
}

function getHeatColor(intensity: number): string {
  const clamped = Math.min(1, Math.max(0, intensity));
  if (clamped < 0.5) {
    const t = clamped * 2;
    const r = Math.round(59 + (234 - 59) * t);
    const g = Math.round(130 + (179 - 130) * t);
    const b = Math.round(246 + (8 - 246) * t);
    return `rgb(${r},${g},${b})`;
  }

  const t = (clamped - 0.5) * 2;
  const r = Math.round(234 + (239 - 234) * t);
  const g = Math.round(179 + (68 - 179) * t);
  const b = Math.round(8 + (68 - 8) * t);
  return `rgb(${r},${g},${b})`;
}
