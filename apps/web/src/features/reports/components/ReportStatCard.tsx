"use client";

type ReportStatCardProps = {
  label: string;
  value: string | number;
  description?: string;
};

export function ReportStatCard({
  label,
  value,
  description,
}: ReportStatCardProps) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </section>
  );
}