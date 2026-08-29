"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { useEffect } from "react";

import type { Sale } from "@/features/sales/types/sale";
import { useUpdateSale } from "@/features/sales/mutations/use-update-sale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateSale } from "@/features/sales/mutations/use-create-sale";

import {
  saleFormSchema,
  type SaleFormValues,
} from "@/features/sales/schemas/sale-form.schema";

import type { Customer } from "@/features/customers/types/customer";
import type { Product } from "@/features/products/types/product";

type SaleFormProps = {
  customers: Customer[];
  products: Product[];
  sale?: Sale;
};

export function SaleForm({
  customers,
  products,
  sale,
}: SaleFormProps) {
  const router = useRouter();
  const createSale = useCreateSale();
  const updateSale = useUpdateSale();

  const isEditMode = Boolean(sale);

  const isPending =
    createSale.isPending ||
    updateSale.isPending;

  const {
    control,
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SaleFormValues>({
    resolver: zodResolver(
      saleFormSchema,
    ),

    defaultValues: {
      customerId: sale?.customerId ?? "",

      saleDate: sale?.saleDate
        ? sale.saleDate.slice(0, 10)
        : new Date()
          .toISOString()
          .slice(0, 10),

      paymentMethod:
      sale?.paymentMethod ?? "CASH",

      discount: sale
        ? Number(sale.discount)
        : 0,

      items: sale
        ? sale.items.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            discount: Number(item.discount),
          }))
        : [
            {
              productId: "",
              quantity: 1,
              discount: 0,
            },
          ],
    },
  });

  useEffect(() => {
    if (!sale) {
      return;
    }

    reset({
      customerId: sale.customerId ?? "",

      saleDate:
      sale.saleDate.slice(0, 10),

      paymentMethod:
      sale.paymentMethod,

      discount: Number(
      sale.discount,
      ),

      items: sale.items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        discount: Number(item.discount),
      })),
    });
  }, [sale, reset]);

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

  const saleDiscount =
    useWatch({
      control,
      name: "discount",
    }) ?? 0;

  const itemSubtotal =
    watchedItems.reduce(
      (total, item) => {
        const product =
          products.find(
            (product) =>
              product.id === item?.productId,
          );

        const quantity =
          Number(item?.quantity) || 0;

        const unitPrice =
          product
            ? Number(product.sellingPrice)
            : 0;

        const discount =
          Number(item?.discount) || 0;

        return (
          total +
          Math.max(
            0,
            quantity * unitPrice - discount,
          )
        );
      },
      0,
    );

  const totalAmount = Math.max(
    0,
    itemSubtotal -
      (Number(saleDiscount) || 0),
  );

  const onSubmit = (
    values: SaleFormValues,
  ) => {
    for (const [index, item] of
      values.items.entries()) {
      const product = products.find(
        (product) =>
          product.id === item.productId,
      );

      if (!product) {
        continue;
      }

      const gross =
        item.quantity *
        Number(product.sellingPrice);

      if (item.discount > gross) {
        setError(
          `items.${index}.discount`,
          {
            type: "manual",
            message:
              "Item discount cannot exceed item gross amount",
          },
        );

        return;
      }
    }

    const computedSubtotal =
      values.items.reduce(
        (total, item) => {
          const product = products.find(
            (product) =>
              product.id === item.productId,
          );

          if (!product) {
            return total;
          }

          const gross =
            item.quantity *
            Number(product.sellingPrice);

          return (
            total +
            gross -
            item.discount
          );
        },
        0,
      );

    if (
      values.discount >
      computedSubtotal
    ) {
      setError("discount", {
        type: "manual",
        message:
          "Sale discount cannot exceed subtotal",
      });

      return;
    }

    const payload = {
      customerId:
        values.customerId || undefined,

      saleDate: values.saleDate,

      paymentMethod:
        values.paymentMethod,

      discount: values.discount,

      items: values.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        discount: item.discount,
      })),
    };

    if (sale) {
      updateSale.mutate(
        {
          id: sale.id,
          data: {
            customerId:
              values.customerId || null,
            saleDate:
              values.saleDate,
            paymentMethod:
              values.paymentMethod,
            discount:
              values.discount,
            items: payload.items,
          },
        },
        {
          onSuccess: () => {
            router.replace(
              `/sales/${sale.id}`,
            );
          },
        },
      );

      return;
    }

    createSale.mutate(
      payload,
      {
        onSuccess: () => {
          router.replace("/sales");
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Sale Information */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Sale
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight">
            Sale Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose the customer, date, and payment method.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Field
            label="Customer"
            error={
              errors.customerId?.message
            }
          >
            <select
              {...register("customerId")}
              disabled={isPending}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
            >
              <option value="">
                Walk-in Customer
              </option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Sale Date"
            error={
              errors.saleDate?.message
            }
          >
            <Input
              {...register("saleDate")}
              type="date"
              disabled={isPending}
              className="rounded-xl"
            />
          </Field>

          <Field
            label="Payment Method"
            error={
              errors.paymentMethod?.message
            }
          >
            <select
              {...register("paymentMethod")}
              disabled={isPending}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
            >
              <option value="CASH">
                Cash
              </option>

              <option value="TRANSFER">
                Transfer
              </option>

              <option value="QRIS">
                QRIS
              </option>
            </select>
          </Field>
        </div>
      </section>

      {/* Items */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Line Items
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-tight">
              Sale Items
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Selling price is taken from the product catalog.
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
                discount: 0,
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

            const product =
              products.find(
                (product) =>
                  product.id ===
                  item?.productId,
              );

            const quantity =
              Number(item?.quantity) || 0;

            const unitPrice = product
              ? Number(product.sellingPrice)
              : 0;

            const discount =
              Number(item?.discount) || 0;

            const gross =
              quantity * unitPrice;

            const subtotal = Math.max(
              0,
              gross - discount,
            );

            return (
              <div
                key={field.id}
                className="rounded-2xl border bg-background/40 p-4"
              >
                <div className="grid gap-4 lg:grid-cols-[1.7fr_0.8fr_1fr_1fr_auto] lg:items-end">
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
                    label="Selling Price"
                  >
                    <Input
                      value={
                        product
                          ? formatCurrency(
                              Number(
                                product.sellingPrice,
                              ),
                            )
                          : "—"
                      }
                      readOnly
                      className="rounded-xl bg-muted/40"
                    />
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
                    label="Item Discount"
                    error={
                      itemError?.discount
                        ?.message
                    }
                  >
                    <Input
                      {...register(
                        `items.${index}.discount`,
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
                      disabled={isPending}
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

      {/* Discount */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Discount
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-tight">
              Sale Discount
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Optional discount applied after item subtotals.
            </p>
          </div>

          <Field
            label="Discount"
            error={
              errors.discount?.message
            }
          >
            <Input
              {...register("discount", {
                valueAsNumber: true,
              })}
              type="number"
              min="0"
              step="0.01"
              disabled={isPending}
              className="rounded-xl"
            />
          </Field>
        </div>
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
                ? "Changes apply only while this sale is PENDING."
                : "Sale will be created as PENDING."}
            </p>
          </div>

          <p className="text-2xl font-semibold tracking-tight">
            {formatCurrency(totalAmount)}
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
              sale
                ? `/sales/${sale.id}`
                : "/sales",
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
            ? "Update Sale"
            : "Save Sale"}
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