import type { RecentTransaction } from "@/features/dashboard/types/dashboard";

type RecentTransactionsProps = {
  data: RecentTransaction[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function RecentTransactions({
  data,
}: RecentTransactionsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
        <div>
          <h3 className="font-semibold">
            Recent Transactions
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Latest sales and purchases.
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
          No recent transactions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">
                  Type
                </th>
                <th className="px-5 py-3 font-medium">
                  Party
                </th>
                <th className="px-5 py-3 font-medium">
                  Date
                </th>
                <th className="px-5 py-3 text-right font-medium">
                  Amount
                </th>
                <th className="px-5 py-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((transaction) => (
                <tr
                  key={`${transaction.type}-${transaction.id}`}
                  className="border-b last:border-0 transition-colors duration-150 hover:bg-muted/35"
                >
                  <td className="px-5 py-4 font-medium">
                    {transaction.type}
                  </td>

                  <td className="px-5 py-4">
                    {transaction.party?.name ?? "Walk-in"}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {formatDate(transaction.date)}
                  </td>

                  <td className="px-5 py-4 text-right font-medium">
                    {formatCurrency(transaction.amount)}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full border bg-muted/50 px-2.5 py-1 text-[11px] font-medium tracking-wide">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}