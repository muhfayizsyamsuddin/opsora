"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreatePurchase } from "@/features/purchases/mutations/use-create-purchase";
import { useUpdatePurchase } from "@/features/purchases/mutations/use-update-purchase";

import type { Product } from "@/features/products/types/product";
import type { Supplier } from "@/features/suppliers/types/supplier";
import type { Purchase } from "@/features/purchases/types/purchase";

import {
  purchaseFormSchema,
  type PurchaseFormValues,
} from "@/features/purchases/schemas/purchase-form.schema";

type PurchaseFormProps = {
  suppliers: Supplier[];
  products: Product[];
  purchase?: Purchase;
};

export function PurchaseForm({
  suppliers,
  products,
  purchase,
}: PurchaseFormProps) {
  const router = useRouter();

  const createPurchase = useCreatePurchase();
  const updatePurchase = useUpdatePurchase();

  const isEditMode = Boolean(purchase);

  const isPending =
    createPurchase.isPending ||
    updatePurchase.isPending;

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseFormValues>({
    resolver: zodResolver(
      purchaseFormSchema,
    ),

    defaultValues: {
      supplierId: purchase?.supplierId ?? "",

      purchaseDate: purchase?.purchaseDate
        ? purchase.purchaseDate.slice(0, 10)
        : new Date()
            .toISOString()
            .slice(0, 10),

      items: purchase
        ? purchase.items.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          }))
        : [
            {
              productId: "",
              quantity: 1,
              unitPrice: 0,
            },
          ],
    },
  });

  useEffect(() => {
    if (!purchase) {
      return;
    }

    reset({
      supplierId: purchase.supplierId,

      purchaseDate:
        purchase.purchaseDate.slice(0, 10),

      items: purchase.items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    });
  }, [purchase, reset]);

  const { fields, append, remove } =
    useFieldArray({
      control,
      name: "items",
    });

  const watchedItems =
    useWatch({
      control,
      name: "items",
    }) ?? [];

  const totalAmount =
    watchedItems.reduce(
      (total, item) => {
        const quantity =
          Number(item?.quantity) || 0;

        const unitPrice =
          Number(item?.unitPrice) || 0;

        return (
          total + quantity * unitPrice
        );
      },
      0,
    );

  const onSubmit = (
    values: PurchaseFormValues,
  ) => {
    const payload = {
      supplierId: values.supplierId,

      purchaseDate:
        values.purchaseDate,

      items: values.items.map(
        (item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }),
      ),
    };

    if (purchase) {
      updatePurchase.mutate(
        {
          id: purchase.id,
          data: payload,
        },
        {
          onSuccess: () => {
            router.replace(
              `/purchases/${purchase.id}`,
            );
          },
        },
      );

      return;
    }

    createPurchase.mutate(
      payload,
      {
        onSuccess: () => {
          router.replace("/purchases");
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Purchase Information */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Purchase
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight">
            Purchase Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? "Update the draft purchase."
              : "Select the supplier and purchase date."}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Supplier"
            error={
              errors.supplierId?.message
            }
          >
            <select
              {...register("supplierId")}
              disabled={isPending}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
            >
              <option value="">
                Select supplier
              </option>

              {suppliers.map((supplier) => (
                <option
                  key={supplier.id}
                  value={supplier.id}
                >
                  {supplier.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Purchase Date"
            error={
              errors.purchaseDate?.message
            }
          >
            <Input
              {...register("purchaseDate")}
              type="date"
              disabled={isPending}
              className="rounded-xl"
            />
          </Field>
        </div>
      </section>

      {/* Purchase Items */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Line Items
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-tight">
              Purchase Items
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add the products included in this purchase.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={isPending}
            onClick={() =>
              append({
                productId: "",
                quantity: 1,
                unitPrice: 0,
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => {
            const itemError =
              errors.items?.[index];

            const item =
              watchedItems[index];

            const quantity =
              Number(item?.quantity) || 0;

            const unitPrice =
              Number(item?.unitPrice) || 0;

            const subtotal =
              quantity * unitPrice;

            return (
              <div
                key={field.id}
                className="rounded-2xl border bg-background/40 p-4"
              >
                <div className="grid gap-4 lg:grid-cols-[1.7fr_0.8fr_1fr_auto] lg:items-end">
                  <Field
                    label={`Product ${index + 1}`}
                    error={
                      itemError?.productId
                        ?.message
                    }
                  >
                    <select
                      {...register(
                        `items.${index}.productId`,
                      )}
                      disabled={isPending}
                      className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
                    >
                      <option value="">
                        Select product
                      </option>

                      {products.map(
                        (product) => (
                          <option
                            key={product.id}
                            value={product.id}
                          >
                            {product.name} (
                            {product.sku})
                          </option>
                        ),
                      )}
                    </select>
                  </Field>

                  <Field
                    label="Quantity"
                    error={
                      itemError?.quantity
                        ?.message
                    }
                  >
                    <Input
                      {...register(
                        `items.${index}.quantity`,
                        {
                          valueAsNumber: true,
                        },
                      )}
                      type="number"
                      min="0.01"
                      step="0.01"
                      disabled={isPending}
                      className="rounded-xl"
                    />
                  </Field>

                  <Field
                    label="Unit Price"
                    error={
                      itemError?.unitPrice
                        ?.message
                    }
                  >
                    <Input
                      {...register(
                        `items.${index}.unitPrice`,
                        {
                          valueAsNumber: true,
                        },
                      )}
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isPending}
                      className="rounded-xl"
                    />
                  </Field>

                  <div className="flex items-center gap-2">
                    <div className="min-w-32">
                      <p className="text-xs text-muted-foreground">
                        Subtotal
                      </p>

                      <p className="mt-1 font-semibold">
                        {formatCurrency(
                          subtotal,
                        )}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-lg text-destructive hover:text-destructive"
                      aria-label={`Remove item ${index + 1}`}
                      disabled={
                        fields.length === 1 ||
                        isPending
                      }
                      onClick={() =>
                        remove(index)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {errors.items?.message && (
          <p className="mt-3 text-xs text-destructive">
            {errors.items.message}
          </p>
        )}
      </section>

      {/* Total */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Total Amount
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {isEditMode
                ? "Changes apply only while the purchase is still DRAFT."
                : "Purchase will be created as DRAFT."}
            </p>
          </div>

          <p className="text-2xl font-semibold tracking-tight">
            {formatCurrency(
              totalAmount,
            )}
          </p>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={isPending}
          onClick={() =>
            router.push(
              purchase
                ? `/purchases/${purchase.id}`
                : "/purchases",
            )
          }
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="rounded-xl"
          disabled={isPending}
        >
          {isPending
            ? isEditMode
              ? "Updating..."
              : "Saving..."
            : isEditMode
              ? "Update Purchase"
              : "Save Purchase"}
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}