"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { login } from "@/services/auth.service";
import { storage } from "@/services/storage";
import { useAuthStore } from "@/stores/auth.store";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: login,

    onSuccess(data) {
      console.log("LOGIN SUCCESS", data);

      storage.setAccessToken(data.access_token);
      storage.setRefreshToken(data.refresh_token);
      useAuthStore.getState().setUser(data.user);

      toast.success("Login berhasil");

      router.push("/dashboard");
    },

    onError(error) {
      console.error("LOGIN ERROR", error);

      toast.error("Email atau password salah");
    },
  });
}