"use client";

import { ProductForm } from "@/features/products/components/ProductForm";
import { useCategories } from "@/features/categories/queries/use-categories";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewProductPage() {
  const { hasPermission } = usePermissions();
  const canCreateProduct = hasPermission("products.create");
  const categories = useCategories({
    page: 1,
    per_page: 100,
    sort_by: "name",
    sort_order: "asc",
  });

  if (!canCreateProduct) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create products.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Products
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Add Product
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Create a new product for your catalog.
          </p>
        </div>

        {/* <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => router.push("/products")}
          >
            Back to Products
        </Button> */}
      </div>

      {categories.isLoading ? (
        <div className="h-96 animate-pulse rounded-2xl border bg-muted/30" />
      ) : categories.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load categories.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Product creation requires at least one available category.
          </p>
        </div>
      ) : (
        <ProductForm
          categories={
            categories.data?.data ?? []
          }
        />
      )}
    </div>
  );
}