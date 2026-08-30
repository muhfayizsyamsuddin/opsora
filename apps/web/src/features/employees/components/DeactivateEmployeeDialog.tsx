"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDeleteEmployee } from "@/features/employees/mutations/use-delete-employee";

type DeactivateEmployeeDialogProps = {
  employee:
    | {
        id: string;
        name: string;
      }
    | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function DeactivateEmployeeDialog({
  employee,
  open,
  onOpenChange,
  onSuccess,
}: DeactivateEmployeeDialogProps) {
  const deactivateEmployee =
    useDeleteEmployee();

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (
          !nextOpen &&
          !deactivateEmployee.isPending
        ) {
          onOpenChange(false);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deactivate employee?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will mark{" "}
            <span className="font-medium text-foreground">
              {employee?.name}
            </span>{" "}
            as inactive. Historical attendance,
            leave, payroll, and performance data
            will be preserved.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={
              deactivateEmployee.isPending
            }
          >
            Back
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={
              deactivateEmployee.isPending
            }
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              if (!employee) {
                return;
              }

              deactivateEmployee.mutate(
                employee.id,
                {
                  onSuccess: () => {
                    onOpenChange(false);
                    onSuccess?.();
                  },
                },
              );
            }}
          >
            {deactivateEmployee.isPending
              ? "Deactivating..."
              : "Deactivate Employee"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}