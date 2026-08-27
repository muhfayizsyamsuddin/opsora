"use client";

import { Pencil, Trash2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Category } from "@/features/categories/types/category";

type CategoryTableProps = {
  categories: Category[];
  canUpdate: boolean;
  canDelete: boolean;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

export function CategoryTable({
  categories,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-muted/50">
            <span className="text-lg">∅</span>
          </div>

          <h3 className="mt-4 text-sm font-semibold">
            No categories found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try changing your search or create a new category.
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
                Description
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
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b last:border-0 transition-colors duration-150 hover:bg-muted/30"
              >
                <td className="px-5 py-4 font-medium">
                  {category.name}
                </td>

                <td className="max-w-md px-5 py-4 text-muted-foreground">
                  <p className="truncate">
                    {category.description || "—"}
                  </p>
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {new Intl.DateTimeFormat(
                    "id-ID",
                    {
                      dateStyle: "medium",
                    },
                  ).format(
                    new Date(category.createdAt),
                  )}
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {new Intl.DateTimeFormat(
                    "id-ID",
                    {
                      dateStyle: "medium",
                    },
                  ).format(
                    new Date(category.updatedAt),
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label={`View ${category.name}`}
                      onClick={() =>
                        onView(category)
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
                        aria-label={`Edit ${category.name}`}
                        onClick={() =>
                          onEdit(category)
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
                        aria-label={`Delete ${category.name}`}
                        onClick={() =>
                          onDelete(category)
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