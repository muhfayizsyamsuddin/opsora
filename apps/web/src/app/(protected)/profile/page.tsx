"use client";

import {
  CalendarDays,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { UpdateProfileForm } from "@/features/auth/components/UpdateProfileForm";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/users/queries/use-current-user";
import { useLogout } from "@/hooks/use-logout";

export default function ProfilePage() {
  const user = useCurrentUser();
  const logout = useLogout();

  const formatDate = (value: string) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  if (user.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (user.error || !user.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load your profile.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong while loading your account information.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() => user.refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const data = user.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          View your account information and access details.
        </p>
      </div>

      {/* Profile Information */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Profile Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Your current account information.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          {/* Name */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
              <UserRound className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Name
              </p>

              <p className="mt-1 font-medium">
                {data.name}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Email
              </p>

              <p className="mt-1 break-all font-medium">
                {data.email}
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Role
              </p>

              <div className="mt-1">
                {data.role ? (
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {data.role}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No role assigned
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
              <UserRound className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Status
              </p>

              <div className="mt-1">
                <span
                  className={
                    data.isActive === false
                      ? "inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive"
                      : "inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600"
                  }
                >
                  {data.isActive === false
                    ? "Inactive"
                    : "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile */}
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="border-b px-5 py-5 sm:px-6">
            <h2 className="text-sm font-semibold">
              Edit Profile
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Update your personal account information.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <UpdateProfileForm
              name={data.name}
              email={data.email}
            />
          </div>
        </section>
      
      {/* Account Security */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Account Security
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Change your password to keep your account secure.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <ChangePasswordForm />
        </div>
      </section>

      {/* Account Information */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Account Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Account creation and update information.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          {/* Created */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Created At
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(data.createdAt)}
              </p>
            </div>
          </div>

          {/* Updated */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Updated At
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(data.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Account Actions
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Manage your current session.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-medium">
              Sign out
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              End your current session on this device.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            className="rounded-xl"
            onClick={() => {
              void logout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </section>
    </div>
  );
}