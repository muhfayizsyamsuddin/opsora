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

import { useDeleteDepartment } from "@/features/departments/mutations/use-delete-department";

type DeleteDepartmentDialogProps = {
  department:
    | {
        id: string;
        name: string;
      }
    | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function DeleteDepartmentDialog({
  department,
  open,
  onOpenChange,
  onSuccess,
}: DeleteDepartmentDialogProps) {
  const deleteDepartment =
    useDeleteDepartment();

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (
          !nextOpen &&
          !deleteDepartment.isPending
        ) {
          onOpenChange(false);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete department?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">
              {department?.name}
            </span>
            . Departments with employees cannot be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={
              deleteDepartment.isPending
            }
          >
            Back
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={
              deleteDepartment.isPending
            }
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              if (!department) {
                return;
              }

              deleteDepartment.mutate(
                department.id,
                {
                  onSuccess: () => {
                    onOpenChange(false);
                    onSuccess?.();
                  },
                },
              );
            }}
          >
            {deleteDepartment.isPending
              ? "Deleting..."
              : "Delete Department"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}