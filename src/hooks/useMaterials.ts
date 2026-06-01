"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import apiService from "@/services/apiService";
import type { CourseMaterial } from "@/types/material";

export function useMaterials(courseId: string | null) {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);

  const hasPending = useMemo(
    () => materials.some((material) => material.status === "processing"),
    [materials]
  );

  const loadMaterials = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.materials.getCourseMaterials(courseId);
      setMaterials(response.data.results);
    } catch (err) {
      setError("Unable to load course materials.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const refreshMaterial = useCallback(async (materialId: string) => {
    try {
      const updated = await apiService.materials.getMaterialById(materialId);
      setMaterials((prev) => prev.map((item) => (item.id === materialId ? updated : item)));
    } catch {
      // swallow; best effort
    }
  }, []);

  useEffect(() => {
    void loadMaterials();
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [loadMaterials]);

  useEffect(() => {
    if (!hasPending) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    if (pollingRef.current) return;

    pollingRef.current = window.setInterval(() => {
      materials
        .filter((material) => material.status === "processing")
        .forEach((material) => refreshMaterial(material.id));
    }, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [hasPending, materials]);

  return {
    materials,
    loading,
    error,
    refresh: loadMaterials,
    setMaterials,
  };
}
