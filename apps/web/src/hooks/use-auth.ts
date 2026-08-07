"use client";

import { isAuthenticated } from "@/lib/auth";

export function useAuth() {
  return {
    isAuthenticated: isAuthenticated(),
  };
}