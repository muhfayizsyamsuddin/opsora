"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { me } from "@/services/auth.service";
import { storage } from "@/services/storage";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const [mounted, setMounted] =
    useState(false);

  const {
    user,
    setUser,
    clearAuth,
  } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasAccessToken =
    mounted &&
    !!storage.getAccessToken();

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: me,
    enabled: hasAccessToken,
    retry: false,
  });

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (!hasAccessToken) {
      clearAuth();
      return;
    }

    if (
      query.isSuccess &&
      query.data
    ) {
      setUser(query.data);
    }
  }, [
    mounted,
    hasAccessToken,
    query.isSuccess,
    query.data,
    setUser,
    clearAuth,
  ]);

  const currentUser =
    user ?? query.data ?? null;

  return {
    user: currentUser,

    isAuthenticated:
      mounted &&
      hasAccessToken &&
      !!currentUser,

    isLoading:
      !mounted ||
      (hasAccessToken &&
        (query.isLoading ||
          query.isFetching)),

    isError:
      mounted &&
      hasAccessToken &&
      query.isError,

    refetch: query.refetch,
  };
}