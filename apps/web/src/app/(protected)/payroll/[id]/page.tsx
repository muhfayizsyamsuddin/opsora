"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  CircleUser,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getPayrollById,
  deletePayroll,
} from "@/services/payroll.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function PayrollDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const id = params.id;

  const {
    data: payroll,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["payroll", id],
    queryFn: () => getPayrollById(id),
    enabled: Boolean(id),
  });

  async function handleDelete() {
    try {
        await deletePayroll(id);

        await queryClient.invalidateQueries({
        queryKey: ["payrolls"],
        });

        toast.success(
        "Payroll deleted successfully",
        );

        setIsDeleteOpen(false);
        router.push("/payroll");
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
        const message =
            error.response?.data?.message ??
            "Failed to delete payroll";

        toast.error(message);
        } else {
        toast.error(
            "Failed to delete payroll",
        );
        }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          href="/payroll"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payroll
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Loading payroll...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !payroll) {
    return (
      <div className="space-y-6">
        <Link
          href="/payroll"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payroll
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-destructive">
              Payroll not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const monthName =
    months.find(
      (item) => item.value === payroll.month,
    )?.label ?? payroll.month;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/payroll"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payroll
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Payroll Detail
            </h1>

            <p className="text-sm text-muted-foreground">
              View payroll information.
            </p>
          </div>

          <Button
            variant="destructive"
            onClick={() => setIsDeleteOpen(true)}
            >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center py-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <CircleUser className="h-10 w-10 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold">
              {payroll.employee.name}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {payroll.employee.email}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Employee Information
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Department
                </p>

                <p className="text-sm font-medium">
                  {payroll.employee.department.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Payroll Period
                </p>

                <p className="text-sm font-medium">
                  {monthName} {payroll.year}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Dialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            >
            <DialogContent>
                <DialogHeader>
                <DialogTitle>
                    Delete Payroll?
                </DialogTitle>

                <DialogDescription>
                    This action cannot be undone. This payroll
                    record will be permanently deleted.
                </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => setIsDeleteOpen(false)}
                >
                    Cancel
                </Button>

                <Button
                    variant="destructive"
                    onClick={handleDelete}
                >
                    Delete
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Salary Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-sm text-muted-foreground">
              Base Salary
            </span>

            <span className="text-sm font-medium">
              Rp{" "}
              {payroll.baseSalary.toLocaleString(
                "id-ID",
              )}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-sm text-muted-foreground">
              Bonus
            </span>

            <span className="text-sm font-medium">
              Rp{" "}
              {payroll.bonus.toLocaleString(
                "id-ID",
              )}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-sm text-muted-foreground">
              Deduction
            </span>

            <span className="text-sm font-medium">
              Rp{" "}
              {payroll.deduction.toLocaleString(
                "id-ID",
              )}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-medium">
              Total Salary
            </span>

            <span className="text-xl font-semibold">
              Rp{" "}
              {payroll.totalSalary.toLocaleString(
                "id-ID",
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}