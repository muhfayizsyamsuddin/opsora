"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LoginCard } from "@/features/auth/components/LoginCard";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();

  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
  ]);

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Image
            src="/brand/opsora-wordmark.png"
            alt="Opsora"
            width={260}
            height={80}
            priority
            className="h-auto w-55 object-contain dark:hidden"
          />

          <Image
            src="/brand/opsora-wordmark-dark2.png"
            alt="Opsora"
            width={260}
            height={80}
            priority
            className="hidden h-auto w-55 object-contain dark:block"
          />
        </div>

        <LoginCard />
      </div>
    </main>
  );
}