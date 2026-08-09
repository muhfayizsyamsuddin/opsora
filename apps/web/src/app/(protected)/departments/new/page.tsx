"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { createDepartment } from "@/services/department.service";
import { useQueryClient } from "@tanstack/react-query";

export default function NewDepartmentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Department name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      await createDepartment({
        name: name.trim(),
      });
      await queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      toast.success(
        "Department created successfully",
      );

      router.push("/departments");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Failed to create department";

        toast.error(message);
      } else {
        toast.error(
          "Failed to create department",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/departments"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Departments
        </Link>

        <h1 className="mt-4 text-2xl font-semibold">
          Add Department
        </h1>

        <p className="text-sm text-muted-foreground">
          Create a new department.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium"
              >
                Department Name
              </label>

              <Input
                id="name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Human Resources"
                required
              />
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <Link href="/departments">
                <Button
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create Department"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}