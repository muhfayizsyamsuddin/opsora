"use client";

import Link from "next/link";
import { useParams, useRouter  } from "next/navigation";
import { useQuery, useQueryClient  } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  CalendarDays,
  CircleUser,
  Mail,
  Wallet,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { getEmployeeById, deleteEmployee, } from "@/services/employee.service";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";

export default  function EmployeeDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

  const {
    data: employee,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeById(id),
    enabled: Boolean(id),
  });

  async function handleDelete() {
    try {
        setIsDeleting(true);

        await deleteEmployee(id);

        toast.success("Employee deleted successfully");

        await queryClient.invalidateQueries({
        queryKey: ["employees"],
        });

        router.push("/employees");
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
        const message =
            error.response?.data?.message ??
            "Failed to delete employee";

        toast.error(message);
        } else {
        toast.error("Failed to delete employee");
        }
    } finally {
        setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link href="/employees">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Button>
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Loading employee...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="space-y-6">
        <Link href="/employees">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Button>
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Employee not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/employees">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">
          Employee Detail
        </h1>

        <p className="text-sm text-muted-foreground">
          View employee information.
        </p>
      </div>

      <div className="flex gap-2">
        <Link href={`/employees/${id}/edit`}>
            <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Employee
            </Button>
        </Link>

        <AlertDialog>
            <AlertDialogTrigger
                className="inline-flex h-10 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-xs transition-colors hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50"
                disabled={isDeleting}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Employee
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>
                    Delete Employee?
                </AlertDialogTitle>

                <AlertDialogDescription>
                    Are you sure you want to delete{" "}
                    <span className="font-medium">
                    {employee.name}
                    </span>
                    ? This action cannot be undone.
                </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                <AlertDialogCancel>
                    Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                    {isDeleting ? "Deleting..." : "Delete Employee"}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center py-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <CircleUser className="h-10 w-10 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold">
              {employee.name}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {employee.position}
            </p>

            <span
              className={
                employee.status === "ACTIVE"
                  ? "mt-4 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  : "mt-4 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
              }
            >
              {employee.status}
            </span>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Email
                </p>

                <p className="text-sm font-medium">
                  {employee.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Department
                </p>

                <p className="text-sm font-medium">
                  {employee.department.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Position
                </p>

                <p className="text-sm font-medium">
                  {employee.position}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Wallet className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Salary
                </p>

                <p className="text-sm font-medium">
                  Rp {employee.salary.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Hire Date
                </p>

                <p className="text-sm font-medium">
                  {new Date(
                    employee.hireDate,
                  ).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}