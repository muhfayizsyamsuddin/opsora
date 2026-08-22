"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { logout } from "@/services/auth.service";
import { storage } from "@/services/storage";

export function useLogout() {
  const router = useRouter();
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
      router.replace("/login");
    }
  };
}