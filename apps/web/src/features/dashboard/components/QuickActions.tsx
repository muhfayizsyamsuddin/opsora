import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  UserPlus,
  Building2,
  CalendarPlus,
  ClipboardList,
} from "lucide-react";

const actions = [
  {
    title: "Add Employee",
    href: "/employees/new",
    icon: UserPlus,
  },
  {
    title: "Add Department",
    href: "/departments/new",
    icon: Building2,
  },
  {
    title: "Create Leave",
    href: "/leave/new",
    icon: CalendarPlus,
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: ClipboardList,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex flex-col items-center justify-center rounded-lg border p-6 transition hover:bg-muted"
            >
              <Icon className="mb-3 h-6 w-6" />

              <span className="text-sm font-medium">
                {action.title}
              </span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}