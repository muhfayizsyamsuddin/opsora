import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  UserPlus,
  Clock,
  CalendarCheck,
  Building2,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "New employee added",
    description: "John Doe joined Engineering",
    time: "5 minutes ago",
    icon: UserPlus,
  },
  {
    id: 2,
    title: "Attendance checked in",
    description: "Sarah checked in",
    time: "18 minutes ago",
    icon: Clock,
  },
  {
    id: 3,
    title: "Leave request submitted",
    description: "Michael requested Annual Leave",
    time: "1 hour ago",
    icon: CalendarCheck,
  },
  {
    id: 4,
    title: "Department updated",
    description: "Finance department updated",
    time: "3 hours ago",
    icon: Building2,
  },
];

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3"
            >
              <div className="rounded-lg bg-muted p-2">
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">
                  {activity.title}
                </p>

                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>

              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}