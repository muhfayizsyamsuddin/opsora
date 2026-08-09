"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, CalendarDays, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  getDepartmentById,
  deleteDepartment,
} from "@/services/department.service";

export default function DepartmentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const router = useRouter();
  const queryClient = useQueryClient();

  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: department,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartmentById(id),
    enabled: Boolean(id),
  });

  async function handleDelete() {
    try {
      setIsDeleting(true);

      await deleteDepartment(id);

      await queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      toast.success(
        "Department deleted successfully",
      );

      router.push("/departments");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Failed to delete department";

        toast.error(message);
      } else {
        toast.error(
          "Failed to delete department",
        );
      }
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          href="/departments"
          className="inline-flex items-center text-sm text-muted-foreground hover:underline"
        >
          ← Back to Departments
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Loading department...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !department) {
    return (
      <div className="space-y-6">
        <Link
          href="/departments"
          className="inline-flex items-center text-sm text-muted-foreground hover:underline"
        >
          ← Back to Departments
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Department not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/departments"
        className="inline-flex items-center text-sm text-muted-foreground hover:underline"
      >
        ← Back to Departments
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">
          Department Detail
        </h1>

        <p className="text-sm text-muted-foreground">
          View department information.
        </p>
      </div>

      <div className="flex gap-2">
        <Link href={`/departments/${id}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Department
          </Button>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger
            className="inline-flex h-10 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-xs transition-colors hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50"
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Department
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete Department?
              </AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-medium">
                  {department.name}
                </span>
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete Department"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col items-center py-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold">
              {department.name}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Department Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Name
                </p>

                <p className="text-sm font-medium">
                  {department.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}