"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateCategory } from "@/features/categories/mutations/use-create-category";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/features/categories/schemas/category-form.schema";

type CategoryFormProps = {
  mode?: "create" | "edit";
  defaultValues?: Partial<CategoryFormValues>;
  onSubmitEdit?: (
    values: CategoryFormValues,
  ) => void;
  isSubmittingEdit?: boolean;
};

export function CategoryForm({
  mode = "create",
  defaultValues,
  onSubmitEdit,
  isSubmittingEdit = false,
}: CategoryFormProps) {
  const router = useRouter();
  const createCategory = useCreateCategory();

  const isEditMode = mode === "edit";

  const isPending =
    createCategory.isPending ||
    isSubmittingEdit;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description:
        defaultValues?.description ?? "",
    },
  });

  const onSubmit = (
    values: CategoryFormValues,
  ) => {
    if (isEditMode) {
      onSubmitEdit?.(values);
      return;
    }

    createCategory.mutate(
      {
        name: values.name,
        description:
          values.description || undefined,
      },
      {
        onSuccess: () => {
          router.replace("/categories");
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
            Category
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight">
            Category Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? "Update the category information."
              : "Create a category to organize your products."}
          </p>
        </div>

        <div className="space-y-5">
          <Field
            label="Category Name"
            error={errors.name?.message}
          >
            <Input
              {...register("name")}
              placeholder="Minuman"
              className="rounded-xl"
            />
          </Field>

          <Field
            label="Description"
            error={errors.description?.message}
          >
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Produk minuman"
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
            router.push("/categories")
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
              ? "Update Category"
              : "Save Category"}
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