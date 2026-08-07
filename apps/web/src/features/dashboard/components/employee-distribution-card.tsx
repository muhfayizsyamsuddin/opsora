import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const departments = [
  {
    name: "Engineering",
    employees: 84,
    percentage: 42,
  },
  {
    name: "Operations",
    employees: 56,
    percentage: 28,
  },
  {
    name: "HR",
    employees: 24,
    percentage: 12,
  },
  {
    name: "Finance",
    employees: 18,
    percentage: 9,
  },
  {
    name: "Marketing",
    employees: 18,
    percentage: 9,
  },
];

export function EmployeeDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Distribution</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {departments.map((department) => (
          <div key={department.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{department.name}</span>

              <span className="text-muted-foreground">
                {department.employees}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${department.percentage}%`,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}