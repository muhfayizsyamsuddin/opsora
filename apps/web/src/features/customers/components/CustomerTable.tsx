"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Customer } from "@/features/customers/types/customer";

type CustomerTableProps = {
  customers: Customer[];
  canUpdate: boolean;
  canDelete: boolean;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
};

export function CustomerTable({
  customers,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-muted/50">
            <span className="text-lg">∅</span>
          </div>

          <h3 className="mt-4 text-sm font-semibold">
            No customers found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try changing your search or create a new customer.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-5 py-4">
                Name
              </th>

              <th className="px-5 py-4">
                Phone
              </th>

              <th className="px-5 py-4">
                Email
              </th>

              <th className="px-5 py-4">
                Address
              </th>

              <th className="px-5 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b last:border-0 transition-colors duration-150 hover:bg-muted/30"
              >
                <td className="px-5 py-4 font-medium">
                  {customer.name}
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {customer.phone || "—"}
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {customer.email || "—"}
                </td>

                <td className="max-w-sm px-5 py-4 text-muted-foreground">
                  <p className="truncate">
                    {customer.address || "—"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label={`View ${customer.name}`}
                      onClick={() =>
                        onView(customer)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canUpdate && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-lg"
                        aria-label={`Edit ${customer.name}`}
                        onClick={() =>
                          onEdit(customer)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}

                    {canDelete && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-lg text-destructive hover:text-destructive"
                        aria-label={`Delete ${customer.name}`}
                        onClick={() =>
                          onDelete(customer)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}