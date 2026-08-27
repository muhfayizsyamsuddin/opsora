import type { LowStockProduct } from "@/features/dashboard/types/dashboard";

type LowStockProductsProps = {
  data: LowStockProduct[];
};

export function LowStockProducts({
  data,
}: LowStockProductsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <h3 className="font-semibold">
          Low Stock Products
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Products at or below minimum stock.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
          No low stock products.
        </div>
      ) : (
        <div className="divide-y">
          {data.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-destructive" />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {product.sku}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold">
                  {product.stock}
                </p>

                <p className="text-xs text-muted-foreground">
                  Min {product.minimumStock}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}