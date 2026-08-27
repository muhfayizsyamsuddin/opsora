"use client";

import { CustomerForm } from "@/features/customers/components/CustomerForm";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewCustomerPage() {
  const { hasPermission } = usePermissions();
  const canCreateCustomer = hasPermission("customers.create");

  if (!canCreateCustomer) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create customers.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Customers
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Add Customer
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a new customer record.
        </p>
      </div>

      <CustomerForm />
    </div>
  );
}