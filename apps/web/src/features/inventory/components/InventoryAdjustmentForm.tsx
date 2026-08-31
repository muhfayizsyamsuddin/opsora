"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateInventoryAdjustment } from "@/features/inventory/mutations/use-create-inventory-adjustment";
import {
  inventoryAdjustmentSchema,
  type InventoryAdjustmentFormValues,
} from "@/features/inventory/schemas/inventory-adjustment.schema";

import type { Product } from "@/features/products/types/product";

type InventoryAdjustmentFormProps = {
  products: Product[];
};

export function InventoryAdjustmentForm({
  products,
}: InventoryAdjustmentFormProps) {
  const router = useRouter();
  const adjustment =
    useCreateInventoryAdjustment();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InventoryAdjustmentFormValues>({
    resolver: zodResolver(
      inventoryAdjustmentSchema,
    ),
    defaultValues: {
      product_id: "",
      movement_type: "IN",
      quantity: 1,
      reason: "",
    },
  });

  const selectedProductId = useWatch({
    control,
    name: "product_id",
  });

  const selectedProduct =
    products.find(
      (product) =>
        product.id === selectedProductId,
    );

  const onSubmit = (
    values: InventoryAdjustmentFormValues,
  ) => {
    adjustment.mutate(values, {
      onSuccess: () => {
        router.replace("/inventory");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Inventory
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight">
            Adjust Stock
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Record a manual stock increase or decrease.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Product"
            error={errors.product_id?.message}
          >
            <select
              {...register("product_id")}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
            >
              <option value="">
                Select product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>

            {selectedProduct && (
              <p className="text-xs text-muted-foreground">
                Current stock:{" "}
                <span className="font-medium text-foreground">
                  {selectedProduct.stock}{" "}
                  {selectedProduct.unit}
                </span>
              </p>
            )}
          </Field>

          <Field
            label="Movement Type"
            error={errors.movement_type?.message}
          >
            <select
              {...register("movement_type")}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
            >
              <option value="IN">
                IN — Add Stock
              </option>

              <option value="OUT">
                OUT — Reduce Stock
              </option>
            </select>
          </Field>

          <Field
            label="Quantity"
            error={errors.quantity?.message}
          >
            <Input
              {...register("quantity", {
                valueAsNumber: true,
              })}
              type="number"
              min="1"
              step="1"
              className="rounded-xl"
            />
          </Field>

          <div className="md:col-span-2">
            <Field
              label="Reason"
              error={errors.reason?.message}
            >
              <textarea
                {...register("reason")}
                rows={5}
                placeholder="Physical stock correction"
                className="w-full resize-none rounded-xl border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/20 focus:ring-2 focus:ring-ring"
              />
            </Field>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={adjustment.isPending}
          onClick={() =>
            router.push("/inventory")
          }
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="rounded-xl"
          disabled={adjustment.isPending}
        >
          {adjustment.isPending
            ? "Saving..."
            : "Adjust Stock"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {children}

      {error && (
        <p className="text-xs leading-5 text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}