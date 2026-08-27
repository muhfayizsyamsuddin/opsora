"use client";

import {
  Moon,
  Sun,
} from "lucide-react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { useTheme } from "next-themes";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/categories": "Categories",
  "/suppliers": "Suppliers",
  "/customers": "Customers",
  "/inventory": "Inventory",
  "/purchases": "Purchases",
  "/sales": "Sales",
  "/reports": "Reports",
  "/departments": "Departments",
  "/employees": "Employees",
  "/users": "Users",
  "/roles": "Roles",
  "/permissions": "Permissions",
  "/profile": "Profile",
  "/settings": "Settings",
  "/attendances": "Attendances",
  "/leave-requests": "Leaves",
  "/performance-reviews":
    "Performance Reviews",
  "/payrolls": "Payroll",
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    resolvedTheme,
    setTheme,
  } = useTheme();

  const user = useAuthStore(
    (state) => state.user,
  );

  const title =
    Object.entries(titles).find(
      ([path]) =>
        pathname === path ||
        pathname.startsWith(
          `${path}/`,
        ),
    )?.[1] ?? "Opsora";

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "OP";

  const role =
    user?.roles?.[0] ?? "USER";

  const isDark =
    resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(
      isDark ? "light" : "dark",
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1 pl-14 lg:pl-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Workspace
          </p>

          <h1 className="mt-1 truncate text-xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl"
          aria-label={
            isDark
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          onClick={toggleTheme}
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <div className="hidden h-8 w-px bg-border sm:block" />

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() =>
              router.push("/profile")
            }
            aria-label="Open profile"
          >
            <Avatar className="h-9 w-9 ring-2 ring-background">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="hidden min-w-0 text-left lg:block">
              <p className="truncate text-sm font-semibold">
                {user?.name ?? "User"}
              </p>

              <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
                {role}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}