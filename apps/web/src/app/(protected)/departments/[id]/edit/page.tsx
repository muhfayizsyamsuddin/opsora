"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  getDepartmentById,
  updateDepartment,
} from "@/services/department.service";

export default function EditDepartmentPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: department,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartmentById(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!department) {
      return;
    }

    setName(department.name);
  }, [department]);

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

      await updateDepartment(id, {
        name: name.trim(),
      });

      await queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["department", id],
      });

      toast.success(
        "Department updated successfully",
      );

      router.push(`/departments/${id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Failed to update department";

        toast.error(message);
      } else {
        toast.error(
          "Failed to update department",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          href={`/departments/${id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Department
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Loading department...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !department) {
    return (
      <div className="space-y-6">
        <Link
          href="/departments"
          className="inline-flex items-center text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Departments
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Department not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/departments/${id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Department
        </Link>

        <h1 className="mt-4 text-2xl font-semibold">
          Edit Department
        </h1>

        <p className="text-sm text-muted-foreground">
          Update department information.
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
              <Link href={`/departments/${id}`}>
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
                  ? "Updating..."
                  : "Update Department"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}