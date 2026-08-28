"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
import {
  productSchema,
  type ProductFormValues,
} from "@/features/products/schemas/product.schema";
import { useUploadProductImage } from "@/features/products/mutations/use-upload-product-image";
import type { Category } from "@/features/categories/types/category";
import type { Product } from "@/features/products/types/product";
import { PRODUCT_UNITS } from "@/features/products/constants/product-units";
import { useCreateProduct } from "@/features/products/mutations/use-create-product";
import { useUpdateProduct } from "@/features/products/mutations/use-update-product";

type ProductFormProps = {
  categories: Category[];
  product?: Product;
};

function generateBarcodeValue() {
  const timestamp = Date.now().toString();

  const random = Math.floor(
    Math.random() * 1000,
  )
    .toString()
    .padStart(3, "0");

  return `${timestamp}${random}`;
}

export function ProductForm({
  categories,
  product,
}: ProductFormProps) {
  const router = useRouter();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const uploadImage = useUploadProductImage();

  const isEditMode = Boolean(product);
  const isPending =
    createProduct.isPending ||
    updateProduct.isPending ||
    uploadImage.isPending;

  const {
    register,
    control,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: "",
      sku: "",
      categoryId: "",
      barcode: "",
      purchasePrice: 0,
      sellingPrice: 0,
      minimumStock: 0,
      unit: "pcs",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (!product) {
      return;
    }

    reset({
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      barcode: product.barcode ?? "",
      purchasePrice: Number(product.purchasePrice),
      sellingPrice: Number(product.sellingPrice),
      minimumStock: Number(product.minimumStock),
      unit: product.unit,
      status: product.status,
    });
  }, [product, reset]);

  const onSubmit = (
    values: ProductFormValues,
  ) => {
    const payload = {
      name: values.name,
      sku: values.sku,
      categoryId: values.categoryId,
      barcode: values.barcode || undefined,
      purchasePrice: values.purchasePrice,
      sellingPrice: values.sellingPrice,
      minimumStock: values.minimumStock,
      unit: values.unit,
      status: values.status,
    };

    if (product) {
      updateProduct.mutate(
        {
          id: product.id,
          data: payload,
        },
        {
          onSuccess: () => {
            router.replace("/products");
          },
        },
      );

      return;
    }

    createProduct.mutate(
      payload,
      {
        onSuccess: () => {
          router.replace("/products");
        },
      },
    );
  };

  const barcodeValue = watch("barcode");

  const handleGenerateBarcode = () => {
    setValue(
      "barcode",
      generateBarcodeValue(),
      {
        shouldDirty: true,
        shouldValidate: true,
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
            Product
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight">
            Product Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? "Update the information for this product."
              : "Enter the basic information for this product."}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Product Name"
            error={errors.name?.message}
          >
            <Input
              {...register("name")}
              placeholder="Air Mineral"
              className="rounded-xl"
            />
          </Field>

          <Field
            label="SKU"
            error={errors.sku?.message}
          >
            <Input
              {...register("sku")}
              placeholder="AM-001"
              className="rounded-xl"
            />
          </Field>

          <Field
            label="Category"
            error={errors.categoryId?.message}
          >
            <select
              {...register("categoryId")}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
            >
              <option value="">
                Select category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Barcode"
            error={errors.barcode?.message}
          >
            <div className="flex gap-2">
              <Input
                {...register("barcode")}
                placeholder="Optional barcode"
                className="rounded-xl"
              />

              <Button
                type="button"
                variant="outline"
                className="shrink-0 rounded-xl"
                onClick={handleGenerateBarcode}
              >
                Generate
              </Button>
            </div>

            {barcodeValue && (
              <p className="text-xs text-muted-foreground">
                Code: {barcodeValue}
              </p>
            )}
          </Field>
        </div>
      </section>

      {isEditMode && product && (
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Media
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-tight">
              Product Image
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload an image to help identify this product.
            </p>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border bg-muted">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            <div className="space-y-3">
              <input
                id="product-image"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadImage.isPending}
                onChange={(event) => {
                  const file =
                    event.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  uploadImage.mutate({
                    id: product.id,
                    file,
                  });

                  event.target.value = "";
                }}
              />

              <label
                htmlFor="product-image"
                className="inline-flex cursor-pointer items-center rounded-xl border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <ImagePlus className="mr-2 h-4 w-4" />

                {uploadImage.isPending
                  ? "Uploading..."
                  : "Upload Image"}
              </label>

              <p className="text-xs text-muted-foreground">
                Select an image from your device.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Operations
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight">
            Pricing & Inventory
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Set pricing, minimum stock, unit, and product status.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Purchase Price"
            error={errors.purchasePrice?.message}
          >
            <Input
              {...register("purchasePrice", {
                valueAsNumber: true,
              })}
              type="number"
              min="0"
              step="0.01"
              className="rounded-xl"
            />
          </Field>

          <Field
            label="Selling Price"
            error={errors.sellingPrice?.message}
          >
            <Input
              {...register("sellingPrice", {
                valueAsNumber: true,
              })}
              type="number"
              min="0"
              step="0.01"
              className="rounded-xl"
            />
          </Field>

          <Field
            label="Minimum Stock"
            error={errors.minimumStock?.message}
          >
            <Input
              {...register("minimumStock", {
                valueAsNumber: true,
              })}
              type="number"
              min="0"
              step="1"
              className="rounded-xl"
            />
          </Field>

          <Field
            label="Unit"
            error={errors.unit?.message}
          >
            <Controller
              control={control}
              name="unit"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>

                  <SelectContent>
                    {PRODUCT_UNITS.map((unit) => (
                      <SelectItem
                        key={unit.value}
                        value={unit.value}
                      >
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field
            label="Status"
            error={errors.status?.message}
          >
            <select
              {...register("status")}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>
          </Field>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => router.push("/products")}
          disabled={isPending}
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
              ? "Update Product"
              : "Save Product"}
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