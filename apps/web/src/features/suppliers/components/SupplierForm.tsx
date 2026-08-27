"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateSupplier } from "@/features/suppliers/mutations/use-create-supplier";
import {
  supplierFormSchema,
  type SupplierFormValues,
} from "@/features/suppliers/schemas/supplier-form.schema";

type SupplierFormProps = {
  mode?: "create" | "edit";
  defaultValues?: Partial<SupplierFormValues>;
  onSubmitEdit?: (
    values: SupplierFormValues,
  ) => void;
  isSubmittingEdit?: boolean;
};

export function SupplierForm({
  mode = "create",
  defaultValues,
  onSubmitEdit,
  isSubmittingEdit = false,
}: SupplierFormProps) {
  const router = useRouter();
  const createSupplier = useCreateSupplier();

  const isEditMode = mode === "edit";

  const isPending =
    createSupplier.isPending ||
    isSubmittingEdit;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      phone: defaultValues?.phone ?? "",
      email: defaultValues?.email ?? "",
      address: defaultValues?.address ?? "",
    },
  });

  const onSubmit = (
    values: SupplierFormValues,
  ) => {
    if (isEditMode) {
      onSubmitEdit?.(values);
      return;
    }

    createSupplier.mutate(
      {
        name: values.name,
        phone: values.phone || undefined,
        email: values.email || undefined,
        address: values.address || undefined,
      },
      {
        onSuccess: () => {
          router.replace("/suppliers");
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
            Supplier
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight">
            Supplier Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? "Update supplier information."
              : "Add supplier contact and address information."}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Supplier Name"
            error={errors.name?.message}
          >
            <Input
              {...register("name")}
              placeholder="PT Supplier PUT Test"
              className="rounded-xl"
            />
          </Field>

          <Field
            label="Phone"
            error={errors.phone?.message}
          >
            <Input
              {...register("phone")}
              placeholder="081234567890"
              className="rounded-xl"
            />
          </Field>

          <Field
            label="Email"
            error={errors.email?.message}
          >
            <Input
              {...register("email")}
              type="email"
              placeholder="supplier@example.com"
              className="rounded-xl"
            />
          </Field>

          <Field
            label="Address"
            error={errors.address?.message}
          >
            <textarea
              {...register("address")}
              rows={4}
              placeholder="Bandung"
              className="w-full resize-none rounded-xl border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/20 focus:ring-2 focus:ring-ring"
            />
          </Field>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={isPending}
          onClick={() =>
            router.push("/suppliers")
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
              ? "Update Supplier"
              : "Save Supplier"}
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