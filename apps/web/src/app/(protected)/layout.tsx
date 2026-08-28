"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/layouts/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const {
    isAuthenticated,
    isLoading,
    isError,
    refetch,
  } = useAuth();

  useEffect(() => {
    if (
      !isLoading &&
      !isAuthenticated &&
      !isError
    ) {
      router.replace("/login");
    }
  }, [
    isAuthenticated,
    isLoading,
    isError,
    router,
  ]);

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
          <h1 className="font-semibold">
            Unable to verify your session.
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Please check your connection and try again.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => {
              void refetch();
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}