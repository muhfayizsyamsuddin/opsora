import PDFDocument from "pdfkit";
import path from "node:path";
import {
  fileURLToPath,
} from "node:url";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const logoPath = path.resolve(
  __dirname,
  "../../../assets/brand/opsora-wordmark.png",
);

type InvoiceData = Awaited<
  ReturnType<
    typeof import("./sale.service.js").SaleService.getInvoice
  >
>;

function formatCurrency(
  value: number | string | { toString(): string },
) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function drawLine(
  doc: PDFKit.PDFDocument,
  y: number,
) {
  doc
    .moveTo(50, y)
    .lineTo(545, y)
    .strokeColor("#E5E7EB")
    .lineWidth(1)
    .stroke();
}

export function createSaleInvoicePdf(
  invoice: InvoiceData,
) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    info: {
      Title: `Invoice ${invoice.invoiceNumber}`,
      Author: "Opsora",
      Subject: "Sales Invoice",
    },
  });

  // Header
  doc.image(
    logoPath,
    50,
    45,
    {
      width: 155,
    },
  );

  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .fillColor("#111827")
    .text("INVOICE", 350, 50, {
      width: 195,
      align: "right",
    });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#6B7280")
    .text(
      invoice.invoiceNumber,
      350,
      82,
      {
        width: 195,
        align: "right",
      },
    );

  drawLine(doc, 115);

  // Invoice information
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#6B7280")
    .text("BILL TO", 50, 140);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111827")
    .text(
      invoice.customer?.name ??
        "Walk-in Customer",
      50,
      158,
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#6B7280")
    .text("INVOICE DETAILS", 330, 140);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#111827")
    .text(
      `Date: ${formatDate(invoice.saleDate)}`,
      330,
      158,
      {
        width: 215,
      },
    )
    .text(
      `Payment: ${invoice.paymentMethod}`,
      330,
      176,
      {
        width: 215,
      },
    )
    .text(
      `Cashier: ${invoice.cashier.name}`,
      330,
      194,
      {
        width: 215,
      },
    );

  // Table
  const tableTop = 240;

  doc
    .rect(50, tableTop, 495, 30)
    .fill("#F3F4F6");

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#374151");

  doc.text("ITEM", 60, tableTop + 10, {
    width: 180,
  });

  doc.text("QTY", 250, tableTop + 10, {
    width: 45,
    align: "right",
  });

  doc.text("PRICE", 305, tableTop + 10, {
    width: 100,
    align: "right",
  });

  doc.text("TOTAL", 415, tableTop + 10, {
    width: 120,
    align: "right",
  });

  let y = tableTop + 42;

  doc.font("Helvetica").fontSize(9);

  for (const item of invoice.items) {
    // Simple page break protection
    if (y > 690) {
      doc.addPage();
      y = 60;
    }

    doc
      .fillColor("#111827")
      .text(item.productName, 60, y, {
        width: 180,
      });

    doc.text(
      Number(item.quantity).toLocaleString(
        "id-ID",
      ),
      250,
      y,
      {
        width: 45,
        align: "right",
      },
    );

    doc.text(
      formatCurrency(item.unitPrice),
      305,
      y,
      {
        width: 100,
        align: "right",
      },
    );

    doc.text(
      formatCurrency(item.subtotal),
      415,
      y,
      {
        width: 120,
        align: "right",
      },
    );

    y += 26;

    drawLine(doc, y - 8);
  }

  y += 15;

  // Totals
  const labelX = 335;
  const valueX = 415;

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#6B7280")
    .text("Subtotal", labelX, y, {
      width: 70,
    });

  doc
    .fillColor("#111827")
    .text(
      formatCurrency(invoice.subtotal),
      valueX,
      y,
      {
        width: 120,
        align: "right",
      },
    );

  y += 22;

  doc
    .fillColor("#6B7280")
    .text("Discount", labelX, y, {
      width: 70,
    });

  doc
    .fillColor("#111827")
    .text(
      formatCurrency(invoice.discount),
      valueX,
      y,
      {
        width: 120,
        align: "right",
      },
    );

  y += 28;

  drawLine(doc, y);

  y += 14;

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111827")
    .text("TOTAL", labelX, y, {
      width: 70,
    });

  doc
    .fontSize(13)
    .text(
      formatCurrency(invoice.totalAmount),
      valueX,
      y,
      {
        width: 120,
        align: "right",
      },
    );

  y += 65;

  if (y > 720) {
    doc.addPage();
    y = 60;
  }

  // Footer
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#111827")
    .text("Thank you for your business.", 50, y);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6B7280")
    .text(
      "This invoice was generated electronically by Opsora.",
      50,
      y + 18,
    );

  return doc;
}