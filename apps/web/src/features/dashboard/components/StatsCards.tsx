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

type StatsCardsProps = {
  totalEmployees: number;
  totalDepartments: number;
  presentToday: number;
  pendingLeaves: number;
};

export function StatsCards({
  totalEmployees,
  totalDepartments,
  presentToday,
  pendingLeaves,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Employees",
      value: totalEmployees,
      icon: Users,
    },
    {
      title: "Departments",
      value: totalDepartments,
      icon: Building2,
    },
    {
      title: "Attendance Today",
      value: presentToday,
      icon: UserCheck,
    },
    {
      title: "Leave Requests",
      value: pendingLeaves,
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                {item.value.toLocaleString("id-ID")}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}