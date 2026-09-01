"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Boxes,
  Building2,
  CalendarCheck,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  ClipboardPenLine,
  LayoutDashboard,
  Menu,
  Package,
  RotateCcw,
  SettingsIcon,
  ShieldCheck,
  ShoppingCart,
  Store,
  Tags,
  UserCog,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";

type MenuItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  permission?: string;
};

const coreMenuItems: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "dashboard.read",
  },
  {
    name: "Products",
    href: "/products",
    icon: Package,
    permission: "products.read",
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Tags,
    permission: "categories.read",
  },
  {
    name: "Suppliers",
    href: "/suppliers",
    icon: Store,
    permission: "suppliers.read",
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
    permission: "customers.read",
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Boxes,
    permission: "inventory-movements.read",
  },
  {
    name: "Purchases",
    href: "/purchases",
    icon: ClipboardList,
    permission: "purchases.read",
  },
  {
    name: "Purchase Returns",
    href: "/purchase-returns",
    icon: RotateCcw,
    permission: "purchases.read",
  },
  {
    name: "Sales",
    href: "/sales",
    icon: ShoppingCart,
    permission: "sales.read",
  },
  {
    name: "Sale Returns",
    href: "/sale-returns",
    icon: RotateCcw,
    permission: "sales.read",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: CircleDollarSign,
    permission: "reports.read",
  },
];

const peopleMenuItems: MenuItem[] = [
  {
    name: "Departments",
    href: "/departments",
    icon: Building2,
    permission: "departments.read",
  },
  {
    name: "Employees",
    href: "/employees",
    icon: Users,
    permission: "employees.read",
  },
  {
    name: "Attendances",
    href: "/attendances",
    icon: ClipboardCheck,
    permission: "attendances.read",
  },
  {
    name: "Leaves",
    href: "/leave-requests",
    icon: CalendarCheck,
    permission: "leaves.read",
  },
  {
    name: "Performance Reviews",
    href: "/performance-reviews",
    icon: ClipboardPenLine,
    permission: "performance_reviews.read",
  },
  {
    name: "Payroll",
    href: "/payrolls",
    icon: WalletCards,
    permission: "payroll.read",
  },
];

const administrationMenuItems: MenuItem[] = [
  {
    name: "Users",
    href: "/users",
    icon: UserCog,
    permission: "users.read",
  },
  {
    name: "Roles",
    href: "/roles",
    icon: ShieldCheck,
    permission: "roles.read",
  },
  {
    name: "Permissions",
    href: "/permissions",
    icon: ShieldCheck,
    permission: "permissions.read",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    permission: "settings.read",
  },
];

function SidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { hasPermission } = usePermissions();

  const visibleCoreMenuItems =
    coreMenuItems.filter(
      (item) =>
        !item.permission ||
        hasPermission(item.permission),
    );

  const visiblePeopleMenuItems =
    peopleMenuItems.filter(
      (item) =>
        !item.permission ||
        hasPermission(item.permission),
    );

  const visibleAdministrationMenuItems =
    administrationMenuItems.filter(
      (item) =>
        !item.permission ||
        hasPermission(item.permission),
    );

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-center border-b px-5">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center"
        >
            <Image
              src="/brand/opsora-wordmark.png"
              alt="Opsora"
              width={180}
              height={48}
              priority
              className="h-15 w-auto object-contain dark:hidden"
            />

            <Image
              src="/brand/opsora-wordmark-dark2.png"
              alt="Opsora"
              width={180}
              height={48}
              priority
              className="hidden h-15 w-auto object-contain dark:block"
            />
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Core Business
        </p>

        <div className="space-y-1">
          {visibleCoreMenuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`,
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium",
                  "transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-transform duration-200",
                    !isActive &&
                      "group-hover:translate-x-0.5",
                  )}
                />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
        {visiblePeopleMenuItems.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              People Operations
            </p>

            <div className="space-y-1">
              {visiblePeopleMenuItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(
                    `${item.href}/`,
                  );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium",
                      "transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-transform duration-200",
                        !isActive &&
                          "group-hover:translate-x-0.5",
                      )}
                    />

                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {visibleAdministrationMenuItems.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Administration
            </p>

            <div className="space-y-1">
              {visibleAdministrationMenuItems.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(
                      `${item.href}/`,
                    );

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium",
                        "transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-transform duration-200",
                          !isActive &&
                            "group-hover:translate-x-0.5",
                        )}
                      />

                      <span>{item.name}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </nav>

      <div className="border-t px-1 py-2">
        <div className="text-center">
          <p className="text-xs font-medium text-muted-foreground">
            Opsora Business OS
          </p>

          <p className="mt-0.5 text-[10px] text-muted-foreground/70">
            Business management platform
          </p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background/90 shadow-sm backdrop-blur lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r bg-background lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          />

          <aside className="absolute inset-y-0 left-0 w-[min(88vw,20rem)] border-r bg-background shadow-2xl">
            <div className="absolute right-3 top-4 z-10">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <SidebarContent
              onNavigate={() =>
                setMobileOpen(false)
              }
            />
          </aside>
        </div>
      )}
    </>
  );
}