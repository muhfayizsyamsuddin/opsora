"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

type ProductBarcodeProps = {
  value: string;
};

export function ProductBarcode({
  value,
}: ProductBarcodeProps) {
  const svgRef =
    useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !value) {
      return;
    }

    JsBarcode(
      svgRef.current,
      value,
      {
        format: "CODE128",
        displayValue: true,
        margin: 0,
        height: 56,
        fontSize: 14,
      },
    );
  }, [value]);

  return (
    <div className="overflow-x-auto">
      <svg
        ref={svgRef}
        aria-label={`Barcode ${value}`}
        role="img"
      />
    </div>
  );
}