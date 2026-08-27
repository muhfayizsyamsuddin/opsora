"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useSettings } from "@/features/settings/queries/use-settings";
import { useUpdateSettings } from "@/features/settings/mutations/use-update-settings";

import {
  settingsFormSchema,
  type SettingsFormValues,
} from "@/features/settings/schemas/settings-form.schema";
import { useTheme } from "next-themes";

export function SettingsForm({
  canUpdate,
}: {
  canUpdate: boolean;
}) {
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const { setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isDirty,
    },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(
      settingsFormSchema,
    ),
    defaultValues: {
      company: {
        name: "",
        logo: "",
        phone: "",
        email: "",
        address: "",
      },

      system: {
        theme: "light",
        currency: "IDR",
        dateFormat: "dd/MM/yyyy",
        timeFormat: "24h",
      },
    },
  });

  useEffect(() => {
    if (!settings.data) {
      return;
    }
    if (settings.data.system.theme) {
      setTheme(settings.data.system.theme);
    }

    reset({
      company: {
        name:
          settings.data.company.name ??
          "",
        logo:
          settings.data.company.logo ??
          "",
        phone:
          settings.data.company.phone ??
          "",
        email:
          settings.data.company.email ??
          "",
        address:
          settings.data.company.address ??
          "",
      },

      system: {
        theme:
          settings.data.system.theme ===
          "dark"
            ? "dark"
            : "light",

        currency:
          settings.data.system.currency ??
          "IDR",

        dateFormat:
          settings.data.system.dateFormat ??
          "dd/MM/yyyy",

        timeFormat:
          settings.data.system.timeFormat ===
          "12h"
            ? "12h"
            : "24h",
      },
    });
  }, [
    settings.data,
    reset,
    setTheme,
  ]);

  const onSubmit = (
    values: SettingsFormValues,
  ) => {
    updateSettings.mutate(
      {
        company: {
          name:
            values.company.name,
          logo:
            values.company.logo,
          phone:
            values.company.phone,
          email:
            values.company.email,
          address:
            values.company.address,
        },

        system: {
          theme:
            values.system.theme,
          currency:
            values.system.currency,
          dateFormat:
            values.system.dateFormat,
          timeFormat:
            values.system.timeFormat,
        },
      },
      {
        onSuccess: (updated) => {
          setTheme(
            updated.system.theme ?? "light",
          );
          reset({
            company: {
              name:
                updated.company.name ??
                "",
              logo:
                updated.company.logo ??
                "",
              phone:
                updated.company.phone ??
                "",
              email:
                updated.company.email ??
                "",
              address:
                updated.company.address ??
                "",
            },

            system: {
              theme:
                updated.system.theme ===
                "dark"
                  ? "dark"
                  : "light",

              currency:
                updated.system.currency ??
                "IDR",

              dateFormat:
                updated.system.dateFormat ??
                "dd/MM/yyyy",

              timeFormat:
                updated.system.timeFormat ===
                "12h"
                  ? "12h"
                  : "24h",
            },
          });
        },
      },
    );
  };

  if (settings.isLoading) {
    return (
      <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
    );
  }

  if (settings.error || !settings.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load settings.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            settings.refetch()
          }
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <h2 className="text-sm font-semibold">
            Company Settings
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Configure company identity and contact information.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Company Name
            </label>

            <Input
              {...register(
                "company.name",
              )}
              disabled={!canUpdate}
              className="h-10 rounded-xl"
            />

            {errors.company?.name && (
              <p className="mt-1.5 text-xs text-destructive">
                {
                  errors.company.name
                    .message
                }
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Logo URL
            </label>

            <Input
              {...register(
                "company.logo",
              )}
              disabled={!canUpdate}
              placeholder="https://..."
              className="h-10 rounded-xl"
            />

            {errors.company?.logo && (
              <p className="mt-1.5 text-xs text-destructive">
                {
                  errors.company.logo
                    .message
                }
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Phone
            </label>

            <Input
              {...register(
                "company.phone",
              )}
              disabled={!canUpdate}
              className="h-10 rounded-xl"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Email
            </label>

            <Input
              type="email"
              {...register(
                "company.email",
              )}
              disabled={!canUpdate}
              className="h-10 rounded-xl"
            />

            {errors.company?.email && (
              <p className="mt-1.5 text-xs text-destructive">
                {
                  errors.company.email
                    .message
                }
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Address
            </label>

            <textarea
              {...register(
                "company.address",
              )}
              rows={4}
              disabled={!canUpdate}
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none"
            />

            {errors.company?.address && (
              <p className="mt-1.5 text-xs text-destructive">
                {
                  errors.company.address
                    .message
                }
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <h2 className="text-sm font-semibold">
            System Settings
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Configure system display and formatting preferences.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Theme
            </label>

            <select
              {...register(
                "system.theme",
              )}
              disabled={!canUpdate}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="light">
                Light
              </option>

              <option value="dark">
                Dark
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Currency
            </label>

            <Input
              {...register(
                "system.currency",
              )}
              disabled={!canUpdate}
              placeholder="IDR"
              className="h-10 rounded-xl"
            />

            {errors.system?.currency && (
              <p className="mt-1.5 text-xs text-destructive">
                {
                  errors.system.currency
                    .message
                }
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Date Format
            </label>

            <Input
              {...register(
                "system.dateFormat",
              )}
              disabled={!canUpdate}
              placeholder="dd/MM/yyyy"
              className="h-10 rounded-xl"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Time Format
            </label>

            <select
              {...register(
                "system.timeFormat",
              )}
              disabled={!canUpdate}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="24h">
                24 Hour
              </option>

              <option value="12h">
                12 Hour
              </option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="rounded-xl"
          disabled={
            !canUpdate ||
            updateSettings.isPending ||
            !isDirty
          }
        >
          {updateSettings.isPending
            ? "Saving..."
            : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}