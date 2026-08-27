"use client";

import {
  Eye,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  Permission,
} from "@/features/permissions/types/permission";

type PermissionTableProps = {
  permissions: Permission[];
  onView: (permission: Permission) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
    },
  ).format(new Date(value));
}

export function PermissionTable({
  permissions,
  onView,
}: PermissionTableProps) {
  if (permissions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
        <ShieldCheck className="mx-auto h-5 w-5 text-muted-foreground" />

        <p className="mt-3 font-medium">
          No permissions found.
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
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-5 py-4 text-left font-medium">
                Permission
              </th>

              <th className="px-5 py-4 text-left font-medium">
                Description
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
            {permissions.map(
              (permission) => (
                <tr
                  key={permission.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <p className="break-all font-semibold">
                        {permission.name}
                      </p>
                    </div>
                  </td>

                  <td className="max-w-lg px-5 py-4 text-muted-foreground">
                    {permission.description ??
                      "—"}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                    {formatDate(
                      permission.createdAt,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                        aria-label={`View ${permission.name}`}
                        onClick={() =>
                          onView(permission)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}