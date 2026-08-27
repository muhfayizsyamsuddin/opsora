"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth.store";
import { logout } from "@/services/auth.service";
import { storage } from "@/services/storage";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const clearAuth = useAuthStore(
    (state) => state.clearAuth,
  );

  return async () => {
    const refreshToken =
      storage.getRefreshToken();

    try {
      if (refreshToken) {
        await logout(refreshToken);
      }
    } finally {
      storage.clearTokens();
      clearAuth();

      queryClient.removeQueries({
        queryKey: ["auth", "me"],
      });

      router.replace("/login");
    }
  };
}