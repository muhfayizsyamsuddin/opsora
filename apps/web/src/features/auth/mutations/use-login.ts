"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { login } from "@/services/auth.service";
import { storage } from "@/services/storage";
import { useAuthStore } from "@/stores/auth.store";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess(data) {
      queryClient.clear();
      storage.setAccessToken(data.access_token);
      storage.setRefreshToken(data.refresh_token);
      useAuthStore.getState().setUser(data.user);

      toast.success("Login berhasil");

      router.replace("/dashboard");
    },

    onError() {
      toast.error("Email atau password salah");
    },
  });
}