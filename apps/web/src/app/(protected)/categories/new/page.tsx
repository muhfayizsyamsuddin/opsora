"use client";

import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewCategoryPage() {
  const { hasPermission } = usePermissions();
  const canCreateCategory = hasPermission("categories.create");

  if (!canCreateCategory) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create categories.
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
          Add Category
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a new product category.
        </p>
      </div>

      <CategoryForm />
    </div>
  );
}