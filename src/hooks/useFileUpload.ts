"use client";

import { useState } from "react";
import apiService from "@/services/apiService";
import type { MaterialUploadPayload } from "@/types/material";

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async ({ course, file }: MaterialUploadPayload) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("course", course);
      formData.append("file", file);

      return await apiService.materials.uploadCourseMaterial(formData);
    } catch (err) {
      setError("Unable to upload the material. Please try again.");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    error,
    uploadFile,
  };
}
