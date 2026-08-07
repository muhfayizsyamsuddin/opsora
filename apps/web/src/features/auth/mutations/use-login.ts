"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { login } from "@/services/auth.service";
import { storage } from "@/services/storage";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: login,

    onSuccess(data) {
      console.log("LOGIN SUCCESS", data);

      storage.setAccessToken(data.accessToken);

      toast.success("Login berhasil");

      router.push("/dashboard");
    },

    onError(error) {
      console.error("LOGIN ERROR", error);

      toast.error("Email atau password salah");
    },
  });
}