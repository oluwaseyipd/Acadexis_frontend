"use client";

import { useState, useEffect, useCallback } from "react";
import apiService from "@/services/apiService";
import { TopicStruggle, HeatmapCell } from "@/types/analytics";

interface UseHeatmapOptions {
  courseId?: string;
  autoFetch?: boolean;
}

export const useHeatmap = ({ courseId, autoFetch = true }: UseHeatmapOptions = {}) => {
  const [data, setData] = useState<TopicStruggle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (course?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, string | number | undefined> = {
        ordering: "-questions_asked",
      };

      const selectedCourse = course ?? courseId;
      if (selectedCourse) {
        params.course = selectedCourse;
      }

      const response = await apiService.analytics.getHeatmap(params);
      setData(response.data.results);
    } catch (err: unknown) {
      const errWithResponse = err as { response?: { status?: number } };
      const status = errWithResponse?.response?.status;

      if (status === 403) {
        setError("Heatmap analytics are only available to lecturers.");
      } else {
        setError("Failed to load heatmap data.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  const cells: HeatmapCell[] = data.map((item) => {
    const questionsAsked = item.questions_asked ?? item.questionsAsked ?? 0;
    const avgConfidence = item.avg_confidence ?? item.avgConfidence ?? 0;
    const strugglingStudents = item.struggling_students ?? item.strugglingStudents ?? 0;

    return {
      topic: item.topic,
      questionsAsked,
      avgConfidence,
      strugglingStudents,
      heatIntensity: Math.min(1, Math.max(0, 1 - avgConfidence)),
    };
  });

  const sortedCells = [...cells].sort((a, b) => b.heatIntensity - a.heatIntensity);

  useEffect(() => {
    if (autoFetch) {
      void fetch();
    }
  }, [courseId, autoFetch, fetch]);

  return {
    data,
    cells: sortedCells,
    isLoading,
    error,
    refetch: fetch,
  };
};
