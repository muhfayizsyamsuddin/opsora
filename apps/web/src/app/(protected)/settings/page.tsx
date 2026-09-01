"use client";

import { SettingsForm } from "@/features/settings/components/settings-form";
import { usePermissions } from "@/hooks/use-permissions";

export default function SettingsPage() {
  const { hasPermission } = usePermissions();

  const canReadSettings =
    hasPermission("settings.read");

  const canUpdateSettings =
    hasPermission("settings.update");

  if (!canReadSettings) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view settings.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Your account does not have the required access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Settings
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage company information and system preferences.
        </p>
      </div>

      <SettingsForm
        canRead={canReadSettings}
        canUpdate={canUpdateSettings}
      />
    </div>
  );
}