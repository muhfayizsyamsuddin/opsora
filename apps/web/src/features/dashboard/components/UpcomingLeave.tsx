import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CalendarDays } from "lucide-react";

const leaves = [
  {
    id: 1,
    name: "John Doe",
    type: "Annual Leave",
    date: "Aug 8",
  },
  {
    id: 2,
    name: "Sarah Smith",
    type: "Sick Leave",
    date: "Aug 10",
  },
  {
    id: 3,
    name: "Michael Lee",
    type: "Annual Leave",
    date: "Aug 12",
  },
];

export function UpcomingLeave() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Leave</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {leaves.map((leave) => (
          <div
            key={leave.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <CalendarDays className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  {leave.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {leave.type}
                </p>
              </div>
            </div>

            <span className="text-xs text-muted-foreground">
              {leave.date}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}