import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CalendarDays } from "lucide-react";

type UpcomingLeaveItem = {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
};

type UpcomingLeaveProps = {
  leaves: UpcomingLeaveItem[];
};

function formatDateRange(
  startDate: string,
  endDate: string,
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startText = start.toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "short",
    },
  );

  const endText = end.toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "short",
    },
  );

  return startText === endText
    ? startText
    : `${startText} - ${endText}`;
}

export function UpcomingLeave({
  leaves,
}: UpcomingLeaveProps) {
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
              {formatDateRange(
                leave.startDate,
                leave.endDate,
              )}
            </span>
          </div>
        ))}

        {leaves.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No upcoming leave.
          </p>
        )}
      </CardContent>
    </Card>
  );
}