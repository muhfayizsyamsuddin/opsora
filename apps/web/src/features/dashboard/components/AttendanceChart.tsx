"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AttendanceChartProps = {
  data: {
    day: string;
    date: string;
    attendance: number;
  }[];
};

export function AttendanceChart({
  data,
}: AttendanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Attendance</CardTitle>
      </CardHeader>

      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="attendance"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="currentColor"
                  stopOpacity={0.4}
                />

                <stop
                  offset="95%"
                  stopColor="currentColor"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis
              allowDecimals={false}
              domain={[0, "dataMax"]}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="attendance"
              stroke="currentColor"
              fill="url(#attendance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}