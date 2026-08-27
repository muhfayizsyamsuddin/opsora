"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { downloadSaleInvoicePdf } from "@/services/sale.service";

export function useDownloadSaleInvoice() {
  return useMutation({
    mutationFn: (id: string) =>
      downloadSaleInvoicePdf(id),

    onError: () => {
      toast.error(
        "Failed to download invoice PDF.",
      );
    },
  });
}