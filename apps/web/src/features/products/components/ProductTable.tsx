import { useState } from "react";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";
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
import { useDeleteProduct } from "@/features/products/mutations/use-delete-product";
import { Button } from "@/components/ui/button";
import type { Product } from "@/features/products/types/product";

type ProductTableProps = {
  products: Product[];
  canUpdate: boolean;
  canDelete: boolean;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

function formatCurrency(value: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function getStockState(product: Product) {
  const stock = Number(product.stock);
  const minimum = Number(product.minimumStock);

  if (stock === 0) {
    return {
      label: "Out of stock",
      className:
        "border-destructive/20 bg-destructive/10 text-destructive",
    };
  }

  if (stock <= minimum) {
    return {
      label: "Low stock",
      className:
        "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }

  return {
    label: "In stock",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
}

export function ProductTable({
  products,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const deleteProduct = useDeleteProduct();

  const [productToDelete, setProductToDelete] =
  useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-muted/50">
            <span className="text-lg">∅</span>
          </div>

          <h3 className="mt-4 text-sm font-semibold">
            No products found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try changing your search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-5 py-4">
                Product
              </th>

              <th className="px-5 py-4">
                SKU
              </th>

              <th className="px-5 py-4">
                Category
              </th>

              <th className="px-5 py-4">
                Stock
              </th>

              <th className="px-5 py-4">
                Price
              </th>

              <th className="px-5 py-4">
                Status
              </th>

              <th className="px-5 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const stockState =
                getStockState(product);

              return (
                <tr
                  key={product.id}
                  className="border-b last:border-0 transition-colors duration-150 hover:bg-muted/30"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border bg-muted">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            N/A
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {product.unit}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                    {product.sku}
                  </td>

                  <td className="px-5 py-4">
                    {product.category.name}
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium">
                        {product.stock}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Min {product.minimumStock}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-medium">
                    {formatCurrency(
                      product.sellingPrice,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${stockState.className}`}
                    >
                      {stockState.label}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-lg"
                        aria-label={`View ${product.name}`}
                        onClick={() =>
                          onView(product)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canUpdate && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="rounded-lg"
                          aria-label={`Edit ${product.name}`}
                          onClick={() =>
                            onEdit(product)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}

                      {canDelete && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="rounded-lg text-destructive hover:text-destructive"
                          aria-label={`Delete ${product.name}`}
                          onClick={() =>
                            onDelete(product)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <AlertDialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => {
            if (!open) {
            setProductToDelete(null);
            }
        }}
        >
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>
                Delete product?
            </AlertDialogTitle>

            <AlertDialogDescription>
                {productToDelete
                ? `This will remove ${productToDelete.name} from the active product list.`
                : "This product will be removed from the active product list."}
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
                onClick={(event) => {
                event.preventDefault();

                if (!productToDelete) {
                    return;
                }

                deleteProduct.mutate(
                    productToDelete.id,
                    {
                    onSuccess: () => {
                        setProductToDelete(null);
                    },
                    },
                );
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
                {deleteProduct.isPending
                ? "Deleting..."
                : "Delete Product"}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </section>
  );
}