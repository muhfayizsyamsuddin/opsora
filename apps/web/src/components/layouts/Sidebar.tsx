"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardCheck,
  CalendarDays,
  Wallet,
  Star,
  BarChart3,
} from "lucide-react";

const menuSections = [
  {
    label: null,
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "People",
    items: [
      {
        name: "Employees",
        href: "/employees",
        icon: Users,
      },
      {
        name: "Departments",
        href: "/departments",
        icon: Building2,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        name: "Attendance",
        href: "/attendance",
        icon: ClipboardCheck,
      },
      {
        name: "Leave",
        href: "/leave",
        icon: CalendarDays,
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        name: "Payroll",
        href: "/payroll",
        icon: Wallet,
      },
    ],
  },
  {
    label: "Performance",
    items: [
      {
        name: "Performance Review",
        href: "/performance-review",
        icon: Star,
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        name: "Reports",
        href: "/reports",
        icon: BarChart3,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r">
      <div className="flex h-16 items-center px-6">
        <span className="text-xl font-bold">OPSORA</span>
      </div>

      <nav className="space-y-5 px-3">
        {menuSections.map((section) => (
          <div key={section.label ?? "dashboard"}>
            {section.label && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map((menu) => {
                const Icon = menu.icon;

                const isActive =
                  pathname === menu.href ||
                  pathname.startsWith(`${menu.href}/`);

                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{menu.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}