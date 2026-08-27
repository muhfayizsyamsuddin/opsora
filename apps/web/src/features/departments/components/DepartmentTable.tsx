"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  Department,
} from "@/features/departments/types/department";

type DepartmentTableProps = {
  departments: Department[];
  canUpdate: boolean;
  canDelete: boolean;
  onView: (
    department: Department,
  ) => void;
  onEdit: (
    department: Department,
  ) => void;
  onDelete: (
    department: Department,
  ) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
    },
  ).format(new Date(value));
}

export function DepartmentTable({
  departments,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: DepartmentTableProps) {
  if (departments.length === 0) {
    return (
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <h3 className="text-sm font-semibold">
            No departments found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try changing your search or create a new department.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-5 py-4">
                Name
              </th>

              <th className="px-5 py-4">
                Created
              </th>

              <th className="px-5 py-4">
                Updated
              </th>

              <th className="px-5 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {departments.map(
              (department) => (
                <tr
                  key={department.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-5 py-4 font-medium">
                    {department.name}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {formatDate(
                      department.createdAt,
                    )}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {formatDate(
                      department.updatedAt,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-lg"
                        aria-label={`View ${department.name}`}
                        onClick={() =>
                          onView(
                            department,
                          )
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
                          aria-label={`Edit ${department.name}`}
                          onClick={() =>
                            onEdit(department)
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
                          aria-label={`Delete ${department.name}`}
                          onClick={() =>
                            onDelete(department)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}