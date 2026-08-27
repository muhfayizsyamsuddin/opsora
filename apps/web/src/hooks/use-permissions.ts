"use client";

import { useAuthStore } from "@/stores/auth.store";

const EMPTY_PERMISSIONS: string[] = [];

export function usePermissions() {
  const permissions = useAuthStore(
    (state) =>
      state.user?.permissions ?? EMPTY_PERMISSIONS,
  );

  const hasPermission = (permission: string) =>
    permissions.includes(permission);

  const hasAnyPermission = (required: string[]) =>
    required.some((permission) =>
      permissions.includes(permission),
    );

  const hasAllPermissions = (required: string[]) =>
    required.every((permission) =>
      permissions.includes(permission),
    );

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}