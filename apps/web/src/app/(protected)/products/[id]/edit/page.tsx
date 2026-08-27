"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ProductForm } from "@/features/products/components/ProductForm";
import { useCategories } from "@/features/categories/queries/use-categories";
import { useProduct } from "@/features/products/queries/use-product";
import { usePermissions } from "@/hooks/use-permissions";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const { hasPermission } = usePermissions();
  const canUpdateProduct = hasPermission("products.update");

  const product = useProduct(id);

  const categories = useCategories({
    page: 1,
    per_page: 100,
    sort_by: "name",
    sort_order: "asc",
  });

  if (
    product.isLoading ||
    categories.isLoading
  ) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-96 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-64 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (product.error || categories.error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load product.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          The product may no longer exist.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push("/products")
          }
        >
          Back to Products
        </Button>
      </div>
    );
  }

  if (
    !product.data ||
    !categories.data
  ) {
    return null;
  }

  if (!canUpdateProduct) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit products.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Products
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Edit Product
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update {product.data.name}.
        </p>
      </div>

      <ProductForm
        product={product.data}
        categories={categories.data.data}
      />
    </div>
  );
}