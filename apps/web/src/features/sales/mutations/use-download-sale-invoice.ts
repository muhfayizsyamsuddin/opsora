"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { downloadSaleInvoicePdf } from "@/services/sale.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useDownloadSaleInvoice() {
  return useMutation({
    mutationFn: (id: string) =>
      downloadSaleInvoicePdf(id),

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to download invoice PDF.",
        ),
      );
    },
  });
}