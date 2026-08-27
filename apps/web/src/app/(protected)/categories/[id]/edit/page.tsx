"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { useCategory } from "@/features/categories/queries/use-category";
import { useUpdateCategory } from "@/features/categories/mutations/use-update-category";
import { usePermissions } from "@/hooks/use-permissions";

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canUpdateCategory = hasPermission("categories.update");

  const category = useCategory(id);
  const updateCategory = useUpdateCategory();

  if (category.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (category.error || !category.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load category.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          The category may no longer exist.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push("/categories")
          }
        >
          Back to Categories
        </Button>
      </div>
    );
  }

  if (!canUpdateCategory) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit categories.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Categories
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Edit Category
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update {category.data.name}.
        </p>
      </div>

      <CategoryForm
        mode="edit"
        defaultValues={{
          name: category.data.name,
          description:
            category.data.description ?? "",
        }}
        isSubmittingEdit={
          updateCategory.isPending
        }
        onSubmitEdit={(values) => {
          updateCategory.mutate(
            {
              id,
              data: {
                name: values.name,
                description:
                  values.description || undefined,
              },
            },
            {
              onSuccess: () => {
                router.replace("/categories");
              },
            },
          );
        }}
      />
    </div>
  );
}