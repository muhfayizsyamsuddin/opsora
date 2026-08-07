"use client";

import { useEffect, useMemo, useState } from "react";
import { isAuthenticated as checkAuth } from "@/lib/auth";

export function useAuth() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = useMemo(() => {
    if (!mounted) return false;
    return checkAuth();
  }, [mounted]);

  return {
    isAuthenticated,
    isLoading: !mounted,
  };
}