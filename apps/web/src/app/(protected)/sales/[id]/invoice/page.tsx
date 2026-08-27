"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useSaleInvoice } from "@/features/sales/queries/use-sale-invoice";
import { usePermissions } from "@/hooks/use-permissions";
import { useDownloadSaleInvoice } from "@/features/sales/mutations/use-download-sale-invoice";

type InvoicePageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatCurrency(value: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function SaleInvoicePage({
  params,
}: InvoicePageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canReadSale = hasPermission("sales.read");

  const invoice = useSaleInvoice(id);
  const downloadInvoice = useDownloadSaleInvoice();

  if (!canReadSale) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view sales invoices.
        </p>
      </div>
    );
  }

  const handleDownloadPdf = () => {
    if (!invoice.data) {
      return;
    }

    downloadInvoice.mutate(id, {
      onSuccess: (blob) => {
        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;
        link.download =
          `${invoice.data.invoiceNumber}.pdf`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);
      },
    });
  };
  
  if (invoice.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-40 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-80 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }
  
  if (invoice.error || !invoice.data) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load invoice.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Invoice is only available for completed sales.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push(`/sales/${id}`)
          }
          >
          Back to Sale
        </Button>
      </div>
    );
  }
  
  const data = invoice.data;

  return (
    <>
      <div className="mx-auto mb-4 flex max-w-3xl flex-wrap justify-end gap-2 print:hidden">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={downloadInvoice.isPending}
          onClick={handleDownloadPdf}
        >
          <Download className="mr-2 h-4 w-4" />

          {downloadInvoice.isPending
            ? "Downloading..."
            : "Download PDF"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => window.print()}
        >
          Print Invoice
        </Button>
      </div>

      <main className="mx-auto max-w-3xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8 print:max-w-none print:rounded-none print:border-0 print:bg-white print:p-0 print:text-black print:shadow-none">
        <header className="flex flex-col gap-6 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Image
              src="/brand/opsora-wordmark.png"
              alt="Opsora"
              width={180}
              height={54}
              priority
              className="h-auto w-36 object-contain dark:hidden print:block"
            />

            <Image
              src="/brand/opsora-wordmark-dark1.png"
              alt="Opsora"
              width={180}
              height={54}
              priority
              className="hidden h-auto w-36 object-contain dark:block print:hidden"
            />

            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
              Sales Invoice
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {data.invoiceNumber}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground">
              Sale Date
            </p>

            <p className="mt-1 font-medium">
              {formatDate(data.saleDate)}
            </p>

            <p className="mt-3 text-xs text-muted-foreground">
              Payment Method
            </p>

            <p className="mt-1 font-medium">
              {data.paymentMethod}
            </p>
          </div>
        </header>

        <section className="grid gap-6 border-b py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">
              Customer
            </p>

            <p className="mt-1 font-semibold">
              {data.customer?.name ??
                "Walk-in Customer"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Cashier
            </p>

            <p className="mt-1 font-semibold">
              {data.cashier.name}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {data.cashier.email}
            </p>
          </div>
        </section>

        <section className="py-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="pb-3">
                    Product
                  </th>

                  <th className="pb-3">
                    Qty
                  </th>

                  <th className="pb-3">
                    Price
                  </th>

                  <th className="pb-3">
                    Discount
                  </th>

                  <th className="pb-3 text-right">
                    Subtotal
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.items.map((item) => (
                  <tr
                    key={item.productId}
                    className="border-b last:border-0"
                  >
                    <td className="py-4 font-medium">
                      {item.productName}
                    </td>

                    <td className="py-4">
                      {item.quantity}
                    </td>

                    <td className="py-4">
                      {formatCurrency(
                        item.unitPrice,
                      )}
                    </td>

                    <td className="py-4">
                      {formatCurrency(
                        item.discount,
                      )}
                    </td>

                    <td className="py-4 text-right font-medium">
                      {formatCurrency(
                        item.subtotal,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex justify-end border-t pt-6">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span className="font-medium">
                {formatCurrency(
                  data.subtotal,
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Discount
              </span>

              <span className="font-medium">
                {formatCurrency(
                  data.discount,
                )}
              </span>
            </div>

            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-2xl font-semibold">
                {formatCurrency(
                  data.totalAmount,
                )}
              </span>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          Thank you for your business.
        </footer>
      </main>
    </>
  );
}