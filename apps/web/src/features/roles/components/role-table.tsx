"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  Role,
} from "@/features/roles/types/role";

type RoleTableProps = {
  roles: Role[];

  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;

  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
    },
  ).format(new Date(value));
}

const SYSTEM_ROLES = new Set([
  "SUPER_ADMIN",
  "OWNER",
  "ADMIN",
  "MANAGER",
  "STAFF",
  "CASHIER",
]);

export function RoleTable({
  roles,
  canRead,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: RoleTableProps) {
  if (roles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
        <p className="font-medium">
          No roles found.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-5 py-4 text-left font-medium">
                Role
              </th>

              <th className="px-5 py-4 text-left font-medium">
                Description
              </th>

              <th className="px-5 py-4 text-left font-medium">
                Permissions
              </th>

              <th className="px-5 py-4 text-left font-medium">
                Created
              </th>

              <th className="px-5 py-4 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {roles.map((role) => (
              <tr
                key={role.id}
                className="transition-colors hover:bg-muted/30"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold">
                    {role.name}
                  </p>
                </td>

                <td className="max-w-sm px-5 py-4 text-muted-foreground">
                  {role.description ?? "—"}
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                    {role.permissions.length}{" "}
                    {role.permissions.length === 1
                      ? "permission"
                      : "permissions"}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                  {formatDate(role.createdAt)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    {canRead && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                        aria-label={`View ${role.name}`}
                        onClick={() =>
                          onView(role)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}

                    {canUpdate && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                        aria-label={`Edit ${role.name}`}
                        onClick={() =>
                          onEdit(role)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}

                    {canDelete &&
                      !SYSTEM_ROLES.has(role.name) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="rounded-xl text-destructive hover:text-destructive"
                          aria-label={`Delete ${role.name}`}
                          onClick={() =>
                            onDelete(role)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}