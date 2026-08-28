"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
import { useDeleteCategory } from "@/features/categories/mutations/use-delete-category";
import { CategoryPagination } from "@/features/categories/components/CategoryPagination";
import { CategoryTable } from "@/features/categories/components/CategoryTable";
import { CategoryToolbar } from "@/features/categories/components/CategoryToolbar";
import { useCategories } from "@/features/categories/queries/use-categories";

import type { Category, CategoryQueryParams } from "@/features/categories/types/category";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: CategoryQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "createdAt",
  sort_order: "desc",
};

export default function CategoriesPage() {
  const router = useRouter();
  const deleteCategory = useDeleteCategory();

  const { hasPermission } = usePermissions();
  const canReadCategory = hasPermission("categories.read");
  const canCreateCategory = hasPermission("categories.create");
  const canUpdateCategory = hasPermission("categories.update");
  const canDeleteCategory = hasPermission("categories.delete");

  const [categoryToDelete, setCategoryToDelete] =
    useState<Category | null>(null);

  const [params, setParams] =
    useState<CategoryQueryParams>(
      DEFAULT_PARAMS,
    );

  const categories = useCategories(
    params,
    canReadCategory,
  );

  const categoryData = categories.data?.data ?? [];

  const meta = categories.data?.meta;
  const hasError = Boolean(categories.error);
  const isLoading = categories.isLoading;

  if (!canReadCategory) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view categories.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Your account does not have the required access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Core Business
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Categories
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Organize products into manageable categories.
          </p>
        </div>

        {canCreateCategory && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push("/categories/new")
            }
          >
            Add Category
          </Button>
        )}
      </div>

      <CategoryToolbar
        params={params}
        onChange={setParams}
      />

      {isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : hasError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load categories.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta?.total ?? 0}{" "}
              {meta?.total === 1
                ? "category"
                : "categories"}
            </p>
          </div>

          <CategoryTable
            categories={categoryData}
            canUpdate={canUpdateCategory}
            canDelete={canDeleteCategory}
            onView={(category) =>
              router.push(
                `/categories/${category.id}`,
              )
            }
            onEdit={(category) =>
              router.push(
                `/categories/${category.id}/edit`,
              )
            }
            onDelete={(category) =>
              setCategoryToDelete(category)
            }
          />

          {meta && (
            <CategoryPagination
              page={meta.page}
              totalPages={meta.total_pages}
              total={meta.total}
              perPage={meta.per_page}
              onPageChange={(page) =>
                setParams((current) => ({
                  ...current,
                  page,
                }))
              }
            />
          )}
        </>
      )}
      <AlertDialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => {
          if (
            !open &&
            !deleteCategory.isPending
          ) {
            setCategoryToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete category?
            </AlertDialogTitle>

            <AlertDialogDescription>
              {categoryToDelete
                ? `This will remove ${categoryToDelete.name} from the active category list.`
                : "This category will be removed from the active category list."}
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
              onClick={(event) => {
                event.preventDefault();

                if (!categoryToDelete) {
                    return;
                }

                deleteCategory.mutate(
                    categoryToDelete.id,
                    {
                    onSuccess: () => {
                        setCategoryToDelete(null);
                    },
                    },
                );
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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