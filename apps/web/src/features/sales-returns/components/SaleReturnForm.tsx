"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateSaleReturn } from "@/features/sales-returns/mutations/use-create-sale-return";

import {
  saleReturnFormSchema,
  type SaleReturnFormValues,
} from "@/features/sales-returns/schemas/sale-return-form.schema";

import type { Sale } from "@/features/sales/types/sale";

type SaleReturnFormProps = {
  sales: Sale[];
};

function getLocalDateValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();

  const localDate = new Date(
    now.getTime() - offset * 60 * 1000,
  );

  return localDate
    .toISOString()
    .slice(0, 10);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
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
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function SaleReturnForm({
  sales,
}: SaleReturnFormProps) {
  const router = useRouter();

  const createSaleReturn =
    useCreateSaleReturn();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SaleReturnFormValues>({
    resolver: zodResolver(
      saleReturnFormSchema,
    ),

    defaultValues: {
      saleId: "",
      returnDate: getLocalDateValue(),
      reason: "",
      items: [
        {
          saleItemId: "",
          quantity: 1,
        },
      ],
    },
  });

  const {
    fields,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: "items",
  });

  const selectedSaleId = useWatch({
    control,
    name: "saleId",
  });

  const watchedItems =
    useWatch({
      control,
      name: "items",
    }) ?? [];

  const selectedSale = sales.find(
    (sale) =>
      sale.id === selectedSaleId,
  );

  const availableItems =
    selectedSale?.items ?? [];

  const saleDiscountRatio =
    selectedSale &&
    Number(selectedSale.subtotal) > 0
      ? Number(
          selectedSale.totalAmount,
        ) /
        Number(selectedSale.subtotal)
      : 0;

  const refundTotal =
    watchedItems.reduce(
      (total, item) => {
        if (!selectedSale) {
          return total;
        }

        const saleItem =
          selectedSale.items.find(
            (candidate) =>
              candidate.id ===
              item?.saleItemId,
          );

        if (!saleItem) {
          return total;
        }

        const returnQuantity =
          Number(item?.quantity) || 0;

        const soldQuantity =
          Number(saleItem.quantity);

        if (
          soldQuantity <= 0 ||
          returnQuantity <= 0
        ) {
          return total;
        }

        const quantityRatio =
          returnQuantity /
          soldQuantity;

        const itemAmountBeforeSaleDiscount =
          Number(saleItem.subtotal) *
          quantityRatio;

        return (
          total +
          itemAmountBeforeSaleDiscount *
            saleDiscountRatio
        );
      },
      0,
    );

  function handleSaleChange(
    saleId: string,
  ) {
    setValue("saleId", saleId, {
      shouldValidate: true,
    });

    replace([
      {
        saleItemId: "",
        quantity: 1,
      },
    ]);
  }

  function onSubmit(
    values: SaleReturnFormValues,
  ) {
    createSaleReturn.mutate(
      {
        saleId: values.saleId,
        returnDate:
          values.returnDate,
        reason:
          values.reason || undefined,
        items: values.items,
      },
      {
        onSuccess: (saleReturn) => {
          router.push(
            `/sale-returns/${saleReturn.id}`,
          );
        },
      },
    );
  }

  const isPending =
    createSaleReturn.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Return Information
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight">
            Sale Return Details
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose a completed sale and
            specify the return date.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Sale"
            error={
              errors.saleId?.message
            }
          >
            <select
              value={selectedSaleId}
              onChange={(event) =>
                handleSaleChange(
                  event.target.value,
                )
              }
              disabled={isPending}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">
                Select completed sale
              </option>

              {sales.map((sale) => (
                <option
                  key={sale.id}
                  value={sale.id}
                >
                  {sale.customer?.name ??
                    "Walk-in Customer"}{" "}
                  —{" "}
                  {new Intl.DateTimeFormat(
                    "id-ID",
                    {
                      dateStyle: "medium",
                    },
                  ).format(
                    new Date(
                      sale.saleDate,
                    ),
                  )}{" "}
                  —{" "}
                  {formatCurrency(
                    Number(
                      sale.totalAmount,
                    ),
                  )}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Return Date"
            error={
              errors.returnDate?.message
            }
          >
            <Input
              {...register(
                "returnDate",
              )}
              type="date"
              disabled={isPending}
              className="rounded-xl"
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field
            label="Reason"
            error={
              errors.reason?.message
            }
          >
            <Input
              {...register("reason")}
              placeholder="Optional return reason"
              disabled={isPending}
              className="rounded-xl"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Line Items
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-tight">
              Return Items
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Select items from the
              completed sale and enter the
              quantity being returned.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={
              isPending ||
              !selectedSale
            }
            onClick={() =>
              append({
                saleItemId: "",
                quantity: 1,
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map(
            (field, index) => {
              const itemError =
                errors.items?.[index];

              const watchedItem =
                watchedItems[index];

              const saleItem =
                availableItems.find(
                  (item) =>
                    item.id ===
                    watchedItem
                      ?.saleItemId,
                );

              const quantity =
                Number(
                  watchedItem
                    ?.quantity,
                ) || 0;

              const soldQuantity =
                saleItem
                  ? Number(
                      saleItem.quantity,
                    )
                  : 0;

              const itemRefund =
                saleItem &&
                soldQuantity > 0
                  ? Number(
                      saleItem.subtotal,
                    ) *
                    (quantity /
                      soldQuantity) *
                    saleDiscountRatio
                  : 0;

              return (
                <div
                  key={field.id}
                  className="rounded-2xl border bg-background/40 p-4"
                >
                  <div className="grid gap-4 lg:grid-cols-[1.7fr_0.8fr_1fr_auto] lg:items-end">
                    <Field
                      label={`Item ${index + 1}`}
                      error={
                        itemError
                          ?.saleItemId
                          ?.message
                      }
                    >
                      <select
                        {...register(
                          `items.${index}.saleItemId`,
                        )}
                        disabled={
                          isPending ||
                          !selectedSale
                        }
                        className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">
                          Select sale item
                        </option>

                        {availableItems.map(
                          (item) => (
                            <option
                              key={
                                item.id
                              }
                              value={
                                item.id
                              }
                            >
                              {
                                item
                                  .product
                                  .name
                              }{" "}
                              (
                              {
                                item
                                  .product
                                  .sku
                              }
                              ) — sold{" "}
                              {
                                item.quantity
                              }{" "}
                              {
                                item
                                  .product
                                  .unit
                              }
                            </option>
                          ),
                        )}
                      </select>
                    </Field>

                    <Field
                      label="Quantity"
                      error={
                        itemError
                          ?.quantity
                          ?.message
                      }
                    >
                      <Input
                        {...register(
                          `items.${index}.quantity`,
                          {
                            valueAsNumber:
                              true,
                          },
                        )}
                        type="number"
                        min="0.01"
                        step="0.01"
                        max={
                          saleItem
                            ? saleItem.quantity
                            : undefined
                        }
                        disabled={
                          isPending ||
                          !saleItem
                        }
                        className="rounded-xl"
                      />
                    </Field>

                    <div className="space-y-2">
                      <Label>
                        Estimated Refund
                      </Label>

                      <div className="flex h-10 items-center rounded-xl border bg-muted/30 px-3 text-sm font-medium">
                        {formatCurrency(
                          itemRefund,
                        )}
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-xl text-destructive hover:text-destructive"
                      disabled={
                        isPending ||
                        fields.length <= 1
                      }
                      onClick={() =>
                        remove(index)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            },
          )}
        </div>

        {typeof errors.items
          ?.message === "string" && (
          <p className="mt-3 text-xs text-destructive">
            {errors.items.message}
          </p>
        )}
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Estimated Refund Total
            </p>

            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {formatCurrency(
                refundTotal,
              )}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Final refund amount is
              calculated by the server.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={isPending}
              onClick={() =>
                router.push(
                  "/sale-returns",
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
                ? "Creating..."
                : "Create Sale Return"}
            </Button>
          </div>
        </div>
      </section>
    </form>
  );
}