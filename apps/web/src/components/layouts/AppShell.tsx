"use client";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/use-auth";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuth();

  return (
    <div className="min-h-screen bg-muted/20 text-foreground">
      <Sidebar />

      <div className="min-h-screen lg:pl-72">
        <Navbar />

        <main className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}