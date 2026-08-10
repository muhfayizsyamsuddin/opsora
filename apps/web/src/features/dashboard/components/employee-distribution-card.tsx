import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EmployeeDistributionProps = {
  departments: {
    id: string;
    name: string;
    totalEmployees: number;
  }[];
};

export function EmployeeDistribution({
  departments,
}: EmployeeDistributionProps) {
  const totalEmployees = departments.reduce(
    (total, department) =>
      total + department.totalEmployees,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Distribution</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {departments.map((department) => {
          const percentage =
            totalEmployees === 0
              ? 0
              : (department.totalEmployees /
                  totalEmployees) *
                100;

          return (
            <div
              key={department.id}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span>{department.name}</span>

                <span className="text-muted-foreground">
                  {department.totalEmployees}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}

        {departments.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No employee distribution data.
          </p>
        )}
      </CardContent>
    </Card>
  );
}