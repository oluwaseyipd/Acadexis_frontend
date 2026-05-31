import { useCallback, useEffect, useState } from "react";
import apiService from "@/services/apiService";
import { Course } from "@/types/course";

interface UseCoursesOptions {
  mode?: "all" | "mine";
  department?: string;
  level?: string;
  search?: string;
  ordering?: string;
}

export const useCourses = (options: UseCoursesOptions = {}) => {
  const { mode = "all", department, level, search, ordering } = options;
  const [page, setPage] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "mine") {
        const response = await apiService.courses.getMyCourses();
        setCourses(response.data);
        setTotalCount(response.data.length);
        setHasNext(false);
        setHasPrevious(false);
      } else {
        const response = await apiService.courses.getAll({
          page,
          department,
          level,
          search,
          ordering,
        });
        setCourses(response.data.results);
        setTotalCount(response.data.count);
        setHasNext(Boolean(response.data.next));
        setHasPrevious(Boolean(response.data.previous));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unable to load courses"));
      setCourses([]);
      setTotalCount(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setIsLoading(false);
    }
  }, [mode, page, department, level, search, ordering]);

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    totalCount,
    page,
    setPage,
    hasNext,
    hasPrevious,
    isLoading,
    error,
    refetch: fetchCourses,
  };
};
