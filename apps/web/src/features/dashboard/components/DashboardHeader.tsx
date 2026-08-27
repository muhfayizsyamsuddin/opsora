type DashboardHeaderProps = {
  userName?: string;
};

export function DashboardHeader({
  userName,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Business Overview
        </p>

        <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Good evening{userName ? `, ${userName}` : ""}.
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Monitor your business activity and key operational metrics.
        </p>
      </div>
    </div>
  );
}