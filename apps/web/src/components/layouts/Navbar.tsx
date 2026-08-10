"use client";

import { usePathname } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/employees": "Employees",
  "/departments": "Departments",
  "/attendance": "Attendance",
  "/leave": "Leave",
  "/payroll": "Payroll",
  "/performance-review": "Performance Review",
  "/reports": "Reports",
};

export function Navbar() {
  const pathname = usePathname();

  const title =
    Object.entries(titles).find(([path]) =>
      pathname === path || pathname.startsWith(`${path}/`)
    )?.[1] ?? "OPSORA";

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <h1 className="text-lg font-semibold">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>

        <div>
          <p className="text-sm font-medium">Admin</p>
          <p className="text-xs text-muted-foreground">
            Administrator
          </p>
        </div>
      </div>
    </header>
  );
}