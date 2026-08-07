"use client";

import { useRouter } from "next/navigation";

import { storage } from "@/services/storage";

export function useLogout() {
  const router = useRouter();

  return () => {
    storage.removeAccessToken();

    router.replace("/login");
  };
}