"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getDepartments } from "@/services/department.service";
import { createEmployee } from "@/services/employee.service";
import { toast } from "sonner";
import axios from "axios";

export default function NewEmployeePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data,
    isLoading: isLoadingDepartments,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      getDepartments({
        page: 1,
        limit: 100,
        sort: "name",
        order: "asc",
      }),
  });

const departments = data?.data ?? [];

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!departmentId) {
      toast.error("Please select a department");
      return;
    }

    if (!salary || Number(salary) <= 0) {
      toast.error("Salary must be greater than 0");
      return;
    }

    if (!hireDate) {
      toast.error("Please select a hire date");
      return;
    }

    try {
      setIsSubmitting(true);

      await createEmployee({
        name,
        email,
        position,
        salary: Number(salary),
        hireDate,
        departmentId,
      });
      await queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      toast.success("Employee created successfully");

      router.push("/employees");
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message =
            error.response?.data?.message ??
            "Failed to create employee";

            toast.error(message);
        } else {
            toast.error("Failed to create employee");
        }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/employees"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Employees
        </Link>

        <h1 className="text-2xl font-semibold">
          Add Employee
        </h1>

        <p className="text-sm text-muted-foreground">
          Create a new employee.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium"
                >
                  Name
                </label>

                <Input
                  id="name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                >
                  Email
                </label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="department"
                  className="text-sm font-medium"
                >
                  Department
                </label>

                <select
                  id="department"
                  value={departmentId}
                  onChange={(event) =>
                    setDepartmentId(event.target.value)
                  }
                  disabled={isLoadingDepartments}
                  required
                  className="flex h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">
                    {isLoadingDepartments
                      ? "Loading departments..."
                      : "Select department"}
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="position"
                  className="text-sm font-medium"
                >
                  Position
                </label>

                <Input
                  id="position"
                  value={position}
                  onChange={(event) =>
                    setPosition(event.target.value)
                  }
                  placeholder="Backend Developer"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="salary"
                  className="text-sm font-medium"
                >
                  Salary
                </label>

                <Input
                  id="salary"
                  type="number"
                  min="1"
                  value={salary}
                  onChange={(event) =>
                    setSalary(event.target.value)
                  }
                  placeholder="5000000"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="hireDate"
                  className="text-sm font-medium"
                >
                  Hire Date
                </label>

                <Input
                  id="hireDate"
                  type="date"
                  value={hireDate}
                  onChange={(event) =>
                    setHireDate(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <Link href="/employees">
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
                  : "Create Employee"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}