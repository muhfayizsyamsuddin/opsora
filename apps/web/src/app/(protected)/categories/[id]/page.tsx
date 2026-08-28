"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Pencil,
  Tag,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCategory } from "@/features/categories/queries/use-category";
import { usePermissions } from "@/hooks/use-permissions";
import { useDeleteCategory } from "@/features/categories/mutations/use-delete-category";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteCategory = useDeleteCategory();
  
  const { hasPermission } = usePermissions();
  const canReadCategory = hasPermission("categories.read");
  const canDelete = hasPermission("categories.delete");
  const canUpdate = hasPermission("categories.update");
  
  const category = useCategory(
    id,
    canReadCategory,
  );

  const handleDelete = () => {
    deleteCategory.mutate(data.id, {
      onSuccess: () => {
        router.push("/categories");
      },
    });
  };

    
  if (!canReadCategory) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this category.
        </p>
      </div>
    );
  }

  if (category.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-muted" />

        <div className="min-h-64 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    category.error ||
    !category.data
  ) {
    return (
      <div className="space-y-6">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() =>
            router.push(
              "/categories",
            )
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load category.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            The category may not exist or something went wrong.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() =>
              category.refetch()
            }
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const data = category.data;


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button
            type="button"
            variant="ghost"
            className="-ml-3 mb-3 rounded-xl"
            onClick={() =>
              router.push(
                "/categories",
              )
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>

          <p className="text-sm font-medium text-muted-foreground">
            Core Business
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Category Details
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            View category information and metadata.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {canUpdate && (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() =>
                router.push(
                  `/categories/${data.id}/edit`,
                )
              }
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Category
            </Button>
          )}

          {canDelete && (
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              disabled={deleteCategory.isPending}
              onClick={() =>
                setShowDeleteDialog(true)
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />

              {deleteCategory.isPending
                ? "Deleting..."
                : "Delete Category"}
            </Button>
          )}
        </div>
      </div>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Category Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Basic information about this category.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border bg-muted/40">
              <Tag className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Name
              </p>

              <p className="mt-1 font-semibold">
                {data.name}
              </p>
            </div>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground">
              Description
            </p>

            <p className="mt-1 text-sm font-medium">
              {data.description ??
                "No description provided."}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Metadata
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Category creation and update information.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Created At
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(
                  data.createdAt,
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Updated At
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(
                  data.updatedAt,
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (
            !open &&
            !deleteCategory.isPending
          ) {
            setShowDeleteDialog(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete category?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will remove{" "}
              <span className="font-medium text-foreground">
                {data.name}
              </span>{" "}
              from the active category list.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteCategory.isPending}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleteCategory.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {deleteCategory.isPending
                ? "Deleting..."
                : "Delete Category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}