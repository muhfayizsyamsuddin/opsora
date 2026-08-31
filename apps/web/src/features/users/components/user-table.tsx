"use client";

import {
  Eye,
  Pencil,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { User } from "@/features/users/types/user";

type UserTableProps = {
  users: User[];
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  currentUserId?: string;
};

export function UserTable({
  users,
  onView,
  onEdit,
  onDelete,
  currentUserId,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center">
        <p className="font-medium">
          No users found.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your search or filters.
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
                User
              </th>

              <th className="px-5 py-4 text-left font-medium">
                Email
              </th>

              <th className="px-5 py-4 text-left font-medium">
                Role
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
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-muted/30"
              >
                <td className="px-5 py-4">
                  <p className="font-medium">
                    {user.name}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span className="text-muted-foreground">
                    {user.email}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {user.role ? (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                      {user.role}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      No role
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                  {new Intl.DateTimeFormat(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  ).format(
                    new Date(
                      user.createdAt,
                    ),
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    {onView && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                        title="View user"
                        onClick={() => onView(user)}
                      >
                        <Eye className="size-4" />
                      </Button>
                    )}

                    {onEdit && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                        title="Edit user"
                        onClick={() => onEdit(user)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    )}

                    {onDelete &&
                      user.id !== currentUserId && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="rounded-xl text-destructive hover:text-destructive"
                          title="Deactivate user"
                          onClick={() => onDelete(user)}
                        >
                          <UserX className="size-4" />
                        </Button>
                      )}
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