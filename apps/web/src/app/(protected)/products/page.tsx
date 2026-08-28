"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { ProductPagination } from "@/features/products/components/ProductPagination";
import { ProductTable } from "@/features/products/components/ProductTable";
import { ProductToolbar } from "@/features/products/components/ProductToolbar";
import { useCategories } from "@/features/categories/queries/use-categories";
import { useProducts } from "@/features/products/queries/use-products";
import type { Product, ProductQueryParams } from "@/features/products/types/product";
import { useDeleteProduct } from "@/features/products/mutations/use-delete-product";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: ProductQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "createdAt",
  sort_order: "desc",
};

export default function ProductsPage() {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canReadProducts = hasPermission("products.read");
  const canCreateProduct = hasPermission("products.create");
  const canUpdateProduct = hasPermission("products.update");
  const canDeleteProduct = hasPermission("products.delete");
  const canReadCategories = hasPermission("categories.read");
  const [params, setParams] =
    useState<ProductQueryParams>(
      DEFAULT_PARAMS,
    );
  const [deleteTarget, setDeleteTarget] =
    useState<Product | null>(null);

  const deleteProduct = useDeleteProduct();

  const categories = useCategories(
    {
      page: 1,
      per_page: 100,
      sort_by: "name",
      sort_order: "asc",
    },
    canReadCategories,
  );

  const products = useProducts(params);

  const categoryData =
    categories.data?.data ?? [];

  const productData =
    products.data?.data ?? [];

  const meta = products.data?.meta;

  const hasError =
    Boolean(products.error) ||
    (canReadCategories &&
      Boolean(categories.error));

  const isLoading =
    products.isLoading ||
    (canReadCategories &&
      categories.isLoading);

  
  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    deleteProduct.mutate(
      deleteTarget.id,
      {
        onSuccess: () => {
          setDeleteTarget(null);
        },
      },
    );
  };

  const headerDescription =
    "Manage your product catalog, stock visibility, and pricing.";

  const resultLabel = useMemo(() => {
    if (!meta) {
      return "Products";
    }

    return `${meta.total} product${meta.total === 1 ? "" : "s"}`;
  }, [meta]);

  if (!canReadProducts) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view products.
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
            Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {headerDescription}
          </p>
        </div>

        {canCreateProduct && (
          <Button
            className="rounded-xl"
            onClick={() => router.push("/products/new")}
          >
            Add Product
          </Button>
                    )}
      </div>

      <ProductToolbar
        params={params}
        categories={
          canReadCategories
            ? categories.data?.data ?? []
            : []
        }
        onChange={setParams}
      />

      {isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : hasError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load products.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {resultLabel}
            </p>
          </div>

          <ProductTable
            products={productData}
            canUpdate={canUpdateProduct}
            canDelete={canDeleteProduct}
            onView={(product) =>
              router.push(
                `/products/${product.id}`,
              )
            }
            onEdit={(product) =>
              router.push(
                `/products/${product.id}/edit`,
              )
            }
            onDelete={(product) =>
              setDeleteTarget(product)
            }
          />

          {meta && (
            <ProductPagination
              page={meta.page}
              totalPages={meta.total_pages}
              total={meta.total}
              perPage={meta.per_page}
              onPageChange={(nextPage) =>
                setParams((current) => ({
                  ...current,
                  page: nextPage,
                }))
              }
            />
          )}
        </>
      )}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (
            !open &&
            !deleteProduct.isPending
          ) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete product?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteProduct.isPending}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleteProduct.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {deleteProduct.isPending
                ? "Deleting..."
                : "Delete Product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}