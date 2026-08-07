"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
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
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-6">
        <h2 className="text-xl font-bold">OPSORA</h2>
      </div>

      <nav className="space-y-1 px-3">
        {menus.map((menu) => {
            const Icon = menu.icon;

            return (
            <Link
                key={menu.href}
                href={menu.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 transition ${
                pathname === menu.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
            >
                <Icon className="h-4 w-4" />
                <span>{menu.name}</span>
            </Link>
            );
        })}
        </nav>
    </aside>
  );
}