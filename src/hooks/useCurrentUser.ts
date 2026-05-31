import { useEffect, useState } from "react";
import apiService from "@/services/apiService";
import { mapBackendUser, useAppStore } from "@/store/useAppStore";
import type { AuthUser } from "@/types/user";

export const useCurrentUser = () => {
  const { user, setUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const freshUser = await apiService.user.me().then((res) => res.data);
      setUser(mapBackendUser(freshUser));
    } catch (err) {
      setError("Failed to load user profile.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.profile?.first_name) {
      refetch();
    }
  }, []);

  return { user, isLoading, error, refetch };
};
