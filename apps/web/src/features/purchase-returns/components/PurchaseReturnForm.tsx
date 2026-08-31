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

import { useCreatePurchaseReturn } from "@/features/purchase-returns/mutations/use-create-purchase-return";

import {
  purchaseReturnFormSchema,
  type PurchaseReturnFormValues,
} from "@/features/purchase-returns/schemas/purchase-return-form.schema";

import type { Purchase } from "@/features/purchases/types/purchase";

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

type PurchaseReturnFormProps = {
  purchases: Purchase[];
};

export function PurchaseReturnForm({
  purchases,
}: PurchaseReturnFormProps) {
  const router = useRouter();

  const createPurchaseReturn =
    useCreatePurchaseReturn();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseReturnFormValues>({
    resolver: zodResolver(
      purchaseReturnFormSchema,
    ),

    defaultValues: {
      purchaseId: "",
      returnDate: getLocalDateValue(),
      reason: "",
      items: [
        {
          purchaseItemId: "",
          quantity: 1,
        },
      ],
    },
  });

  const { fields, append, remove, replace } =
    useFieldArray({
      control,
      name: "items",
    });

  const purchaseId = useWatch({
    control,
    name: "purchaseId",
  });

  const watchedItems =
    useWatch({
      control,
      name: "items",
    }) ?? [];

  const selectedPurchase = purchases.find(
    (purchase) =>
      purchase.id === purchaseId,
  );

  const purchaseItems =
    selectedPurchase?.items ?? [];

  const totalAmount = watchedItems.reduce(
    (total, item) => {
      const purchaseItem =
        purchaseItems.find(
          (purchaseItem) =>
            purchaseItem.id ===
            item?.purchaseItemId,
        );

      if (!purchaseItem) {
        return total;
      }

      const quantity =
        Number(item?.quantity) || 0;

      return (
        total +
        quantity *
          Number(purchaseItem.unitPrice)
      );
    },
    0,
  );

  const handlePurchaseChange = () => {
    replace([
      {
        purchaseItemId: "",
        quantity: 1,
      },
    ]);
  };

  const onSubmit = (
    values: PurchaseReturnFormValues,
  ) => {
    createPurchaseReturn.mutate(
      {
        purchaseId: values.purchaseId,
        returnDate: values.returnDate,
        reason:
          values.reason?.trim() ||
          undefined,
        items: values.items.map(
          (item) => ({
            purchaseItemId:
              item.purchaseItemId,
            quantity: item.quantity,
          }),
        ),
      },
      {
        onSuccess: (purchaseReturn) => {
          router.replace(
            `/purchase-returns/${purchaseReturn.id}`,
          );
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Purchase Return
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight">
            Return Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Select the completed purchase and return date.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Purchase"
            error={
              errors.purchaseId?.message
            }
          >
            <select
              {...register("purchaseId", {
                onChange:
                  handlePurchaseChange,
              })}
              disabled={
                createPurchaseReturn.isPending
              }
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
            >
              <option value="">
                Select completed purchase
              </option>

              {purchases.map((purchase) => (
                <option
                  key={purchase.id}
                  value={purchase.id}
                >
                  {purchase.supplier.name} —{" "}
                  {new Intl.DateTimeFormat(
                    "id-ID",
                    {
                      dateStyle: "medium",
                    },
                  ).format(
                    new Date(
                      purchase.purchaseDate,
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
              {...register("returnDate")}
              type="date"
              disabled={
                createPurchaseReturn.isPending
              }
              className="rounded-xl"
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field
            label="Reason"
            error={errors.reason?.message}
          >
            <Input
              {...register("reason")}
              placeholder="Reason for returning the goods..."
              disabled={
                createPurchaseReturn.isPending
              }
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
              Select items from the original purchase and enter the quantity to return.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={
              !selectedPurchase ||
              createPurchaseReturn.isPending
            }
            onClick={() =>
              append({
                purchaseItemId: "",
                quantity: 1,
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

            const watchedItem =
              watchedItems[index];

            const purchaseItem =
              purchaseItems.find(
                (item) =>
                  item.id ===
                  watchedItem?.purchaseItemId,
              );

            const quantity =
              Number(
                watchedItem?.quantity,
              ) || 0;

            const subtotal = purchaseItem
              ? quantity *
                Number(
                  purchaseItem.unitPrice,
                )
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
                        ?.purchaseItemId
                        ?.message
                    }
                  >
                    <select
                      {...register(
                        `items.${index}.purchaseItemId`,
                      )}
                      disabled={
                        !selectedPurchase ||
                        createPurchaseReturn.isPending
                      }
                      className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
                    >
                      <option value="">
                        Select purchase item
                      </option>

                      {purchaseItems.map(
                        (item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {
                              item.product
                                .name
                            }{" "}
                            ({item.product.sku})
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
                          valueAsNumber:
                            true,
                        },
                      )}
                      type="number"
                      min="0.01"
                      step="0.01"
                      max={
                        purchaseItem
                          ? Number(
                              purchaseItem.quantity,
                            )
                          : undefined
                      }
                      disabled={
                        !selectedPurchase ||
                        createPurchaseReturn.isPending
                      }
                      className="rounded-xl"
                    />
                  </Field>

                  <div className="space-y-2">
                    <Label>Subtotal</Label>

                    <div className="flex h-10 items-center rounded-xl border bg-muted/30 px-3 text-sm font-medium">
                      {formatCurrency(
                        subtotal,
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-xl"
                    disabled={
                      fields.length === 1 ||
                      createPurchaseReturn.isPending
                    }
                    onClick={() =>
                      remove(index)
                    }
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {purchaseItem && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Purchased:{" "}
                    {purchaseItem.quantity}{" "}
                    {purchaseItem.product.unit} ·
                    Unit price:{" "}
                    {formatCurrency(
                      Number(
                        purchaseItem.unitPrice,
                      ),
                    )}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Estimated Return Total
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {formatCurrency(
                totalAmount,
              )}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={
                createPurchaseReturn.isPending
              }
              onClick={() =>
                router.push(
                  "/purchase-returns",
                )
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="rounded-xl"
              disabled={
                createPurchaseReturn.isPending
              }
            >
              {createPurchaseReturn.isPending
                ? "Creating..."
                : "Create Return"}
            </Button>
          </div>
        </div>
      </section>
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
        <p className="text-sm text-destructive">
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