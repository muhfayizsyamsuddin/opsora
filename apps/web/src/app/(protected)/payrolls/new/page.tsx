"use client";

import { PayrollForm } from "@/features/payrolls/components/payroll-form";
import { usePermissions } from "@/hooks/use-permissions";

export default function CreatePayrollPage() {
  const { hasPermission } = usePermissions();
  const canCreatePayroll = hasPermission("payroll.create");

  if (!canCreatePayroll) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create payrolls.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          People Operations
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Create Payroll
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Generate a payroll record for an employee.
        </p>
      </div>

      <PayrollForm />
    </div>
  );
}