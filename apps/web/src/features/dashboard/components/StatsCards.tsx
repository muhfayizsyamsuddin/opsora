import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Users,
  Building2,
  UserCheck,
  CalendarCheck,
} from "lucide-react";

const stats = [
  {
    title: "Employees",
    value: "248",
    icon: Users,
  },
  {
    title: "Departments",
    value: "12",
    icon: Building2,
  },
  {
    title: "Attendance Today",
    value: "231",
    icon: UserCheck,
  },
  {
    title: "Leave Requests",
    value: "8",
    icon: CalendarCheck,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>

              <Icon className="h-5 w-5 text-muted-foreground/70" />
            </CardHeader>

            <CardContent className="pt-2 pb-6">
              <p className="text-4xl font-bold tracking-tight">
                {item.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}