"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { me } from "@/services/auth.service";
import { storage } from "@/services/storage";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const [mounted, setMounted] = useState(false);

  const {
    user,
    isAuthenticated,
    setUser,
    clearAuth,
  } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasAccessToken =
    mounted && !!storage.getAccessToken();

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: me,
    enabled: hasAccessToken,
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data);
    }
  }, [
    query.isSuccess,
    query.data,
    setUser,
  ]);

  useEffect(() => {
    if (
      mounted &&
      query.isError &&
      !storage.getAccessToken()
    ) {
      clearAuth();
    }
  }, [
    mounted,
    query.isError,
    clearAuth,
  ]);

  return {
    user,
    isAuthenticated:
      mounted &&
      isAuthenticated &&
      !!user,
    isLoading:
      !mounted ||
      query.isLoading ||
      query.isFetching,
  };
}