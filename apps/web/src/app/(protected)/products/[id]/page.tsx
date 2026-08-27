"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Barcode,
  CalendarDays,
  DollarSign,
  Package,
  Pencil,
  Tag,
  Trash2,
} from "lucide-react";
import Image from "next/image";
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
import { ProductBarcode } from "@/features/products/components/ProductBarcode";
import { useProduct } from "@/features/products/queries/use-product";
import { useDeleteProduct } from "@/features/products/mutations/use-delete-product";
import { usePermissions } from "@/hooks/use-permissions";
import { useInventoryStockByProduct } from "@/features/inventory/queries/use-inventory-stock-by-product";

function formatCurrency(
  value: string | number,
) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canReadProduct = hasPermission("products.read");
  const canUpdate = hasPermission("products.update");
  const canDelete = hasPermission("products.delete");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    
  const product = useProduct(id);
  const stock = useInventoryStockByProduct(id);
  const deleteProduct = useDeleteProduct();

  if (
    product.isLoading ||
    stock.isLoading
  ) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-muted" />

        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    product.error ||
    stock.error ||
    !product.data
  ) {
    return (
      <div className="space-y-6">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() =>
            router.push("/products")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load product.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            The product may not exist or something went wrong.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() =>
              product.refetch()
            }
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const data = product.data;

  const handleDelete = () => {
    deleteProduct.mutate(
      data.id,
      {
        onSuccess: () => {
          router.push("/products");
        },
      },
    );
  };

  if (!canReadProduct) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this product.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button
            type="button"
            variant="ghost"
            className="-ml-3 mb-3 rounded-xl"
            onClick={() =>
              router.push("/products")
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>

          <p className="text-sm font-medium text-muted-foreground">
            Core Business
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Product Details
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            View product information, pricing, stock,
            and category.
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
                  `/products/${data.id}/edit`,
                )
              }
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          )}

          {canDelete && (
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              disabled={deleteProduct.isPending}
              onClick={() =>
                setShowDeleteDialog(true)
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />

              {deleteProduct.isPending
                ? "Deleting..."
                : "Delete Product"}
            </Button>
          )}
        </div>
      </div>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Product Information
          </h2>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
          <div className="flex items-start gap-3">
            <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Name
              </p>

              <p className="mt-1 font-semibold">
                {data.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Tag className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                SKU
              </p>

              <p className="mt-1 font-medium">
                {data.sku}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Barcode className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Barcode
              </p>

              <p className="mt-1 font-medium">
                {data.barcode ?? "—"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Category
            </p>

            <p className="mt-1 font-medium">
              {data.category?.name ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Unit
            </p>

            <p className="mt-1 font-medium">
              {data.unit}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Status
            </p>

            <span className="mt-1 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium">
              {data.status}
            </span>
          </div>
        </div>
      </section>

      {data.barcode && (
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="border-b px-5 py-5 sm:px-6">
            <h2 className="text-sm font-semibold">
              Product Barcode
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Scannable barcode assigned to this product.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="inline-flex rounded-xl border bg-white p-4">
              <ProductBarcode
                value={data.barcode}
              />
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Inventory Stock
          </h2>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
          <div>
            <p className="text-xs text-muted-foreground">
              Current Stock
            </p>

            <p className="mt-1 font-semibold">
              {stock.data
                ? `${stock.data.stock} ${stock.data.unit}`
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Minimum Stock
            </p>

            <p className="mt-1 font-semibold">
              {stock.data
                ? `${stock.data.minimumStock} ${stock.data.unit}`
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Status
            </p>

            <p className="mt-1 font-semibold">
              {stock.data?.status ?? "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Pricing & Stock
          </h2>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
          <div className="flex items-start gap-3">
            <DollarSign className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Purchase Price
              </p>

              <p className="mt-1 font-medium">
                {formatCurrency(
                  data.purchasePrice,
                )}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Selling Price
            </p>

            <p className="mt-1 font-medium">
              {formatCurrency(
                data.sellingPrice,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Stock
            </p>

            <p className="mt-1 font-medium">
              {data.stock} {data.unit}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Minimum Stock
            </p>

            <p className="mt-1 font-medium">
              {data.minimumStock}{" "}
              {data.unit}
            </p>
          </div>
        </div>
      </section>

      {data.imageUrl && (
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="border-b px-5 py-5 sm:px-6">
            <h2 className="text-sm font-semibold">
              Product Image
            </h2>
          </div>

          <div className="p-5 sm:p-6">
            {/* Using img because imageUrl may come from backend/external storage */}
            <Image
              src={data.imageUrl}
              alt={data.name}
              width={640}
              height={480}
              className="max-h-80 w-auto rounded-xl border object-contain"
            />
          </div>
        </section>
      )}

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Metadata
          </h2>
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
            !deleteProduct.isPending
          ) {
            setShowDeleteDialog(false);
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
                {data.name}
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