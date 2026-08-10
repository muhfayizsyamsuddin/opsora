"use client";

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
  Wallet,
  Star,
} from "lucide-react";

import type { DashboardActivity } from "@/services/report.service";

type RecentActivitiesProps = {
  activities: DashboardActivity[];
};

function getRelativeTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();

  const minutes = Math.floor(diff / 1000 / 60);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function getActivityIcon(type: DashboardActivity["type"]) {
  switch (type) {
    case "EMPLOYEE":
      return UserPlus;

    case "ATTENDANCE":
      return Clock;

    case "LEAVE":
      return CalendarCheck;

    case "PAYROLL":
      return Wallet;

    case "PERFORMANCE":
      return Star;

    default:
      return Clock;
  }
}

export function RecentActivities({
  activities,
}: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);

          return (
            <div
              key={`${activity.type}-${activity.id}`}
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

              <span className="whitespace-nowrap text-xs text-muted-foreground">
                {getRelativeTime(activity.createdAt)}
              </span>
            </div>
          );
        })}

        {activities.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No recent activities.
          </p>
        )}
      </CardContent>
    </Card>
  );
}