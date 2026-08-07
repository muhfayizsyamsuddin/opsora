"use client";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <h1 className="text-lg font-semibold">
        Dashboard
      </h1>

      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
            <AvatarFallback>AD</AvatarFallback>
        </Avatar>

        <div>
          <p className="text-sm font-medium">
            Admin
          </p>

          <p className="text-xs text-muted-foreground">
            Administrator
          </p>
        </div>
      </div>
    </header>
  );
}