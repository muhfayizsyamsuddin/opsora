"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/layouts/AppShell";
import { storage } from "@/services/storage";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated =
    mounted && !!storage.getAccessToken();

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/login");
    }
  }, [
    mounted,
    isAuthenticated,
    router,
  ]);

  if (!mounted || !isAuthenticated) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}