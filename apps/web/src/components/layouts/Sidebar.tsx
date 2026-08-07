"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Employees",
    href: "/employees",
  },
  {
    name: "Departments",
    href: "/departments",
  },
  {
    name: "Settings",
    href: "/settings",
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
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={`block rounded-md px-3 py-2 transition ${
              pathname === menu.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {menu.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}