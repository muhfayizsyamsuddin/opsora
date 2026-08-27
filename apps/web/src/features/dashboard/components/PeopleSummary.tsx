import type { PeopleSummary as PeopleSummaryData } from "@/features/dashboard/types/dashboard";

type PeopleSummaryProps = {
  data: PeopleSummaryData;
};

const items = [
  ["Employees", "totalEmployees"],
  ["Departments", "totalDepartments"],
  ["Present Today", "presentToday"],
  ["Late Today", "lateToday"],
  ["Absent Today", "absentToday"],
  ["Pending Leaves", "pendingLeaves"],
] as const;

export function PeopleSummary({
  data,
}: PeopleSummaryProps) {
  return (
    <section className="rounded-2xl border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <h3 className="font-semibold">
          People Operations Summary
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Workforce information available to your account.
        </p>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
        {items.map(([label, key]) => (
          <div
            key={key}
            className="bg-card px-5 py-5"
          >
            <p className="text-sm text-muted-foreground">
              {label}
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {data[key]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}