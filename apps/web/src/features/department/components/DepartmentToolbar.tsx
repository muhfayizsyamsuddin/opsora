"use client";

import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DepartmentToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function DepartmentToolbar({
  search,
  onSearchChange,
}: DepartmentToolbarProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search departments..."
          className="pl-9"
        />
      </div>

      <Button
        onClick={() =>
          router.push("/departments/new")
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Department
      </Button>
    </div>
  );
}