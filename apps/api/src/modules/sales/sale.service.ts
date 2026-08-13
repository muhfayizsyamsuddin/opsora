import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../errors/AppError.js";
import { Prisma } from "../../generated/prisma/client.js";
import { SaleRepository } from "./sale.repository.js";

type PaymentMethod = "CASH" | "TRANSFER" | "QRIS";

type SaleItemInput = {
  productId: string;
  quantity: number;
  discount: number;
};

type CreateSaleInput = {
  customerId?: string;
  userId: string;
  saleDate: Date;
  paymentMethod: PaymentMethod;
  discount: number;
  items: SaleItemInput[];
};

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export class SaleService {
  static async create(data: CreateSaleInput) {
    if (data.items.length === 0) {
      throw new AppError(
        "Sale must contain at least one item",
        400,
      );
    }

    return prisma.$transaction(async (tx) => {
      if (data.customerId) {
        const customer = await tx.customer.findFirst({
          where: {
            id: data.customerId,
            deletedAt: null,
          },
        });

        if (!customer) {
          throw new AppError("Customer not found", 404);
        }
      }

      const productIds = data.items.map(
        (item) => item.productId,
      );

      const products = await tx.product.findMany({
        where: {
          id: {
            in: productIds,
          },
          deletedAt: null,
          status: "ACTIVE",
        },
      });

      if (products.length !== productIds.length) {
        throw new AppError(
          "One or more products not found",
          404,
        );
      }

      const productMap = new Map(
        products.map((product) => [
          product.id,
          product,
        ]),
      );

      const stockByProduct = new Map<string, Prisma.Decimal>();

      const saleItems = data.items.map((item) => {
        if (item.quantity <= 0) {
            throw new AppError(
                "Sale quantity must be greater than zero",
                400,
            ); 
        }

        if (item.discount < 0) {
          throw new AppError(
            "Sale item discount cannot be negative",
            400,
          );
        }

        const product = productMap.get(item.productId);

        if (!product) {
          throw new AppError("Product not found", 404);
        }

        const quantity = new Prisma.Decimal(
          item.quantity,
        );

        const unitPrice = product.sellingPrice;

        const discount = new Prisma.Decimal(
          item.discount,
        );

        const gross = quantity.mul(unitPrice);

        if (discount.gt(gross)) {
          throw new AppError(
            "Item discount cannot exceed item gross amount",
            400,
          );
        }

        const subtotal = gross.sub(discount);
        const currentStock = stockByProduct.get(product.id) ?? product.stock;
        const afterStock = currentStock.sub(quantity);

        if (afterStock.lt(0)) {
          throw new AppError(
            `Insufficient stock for product: ${product.name}`,
            400,
          );
        }
        stockByProduct.set(product.id, afterStock);

        return {
          product,
          productId: product.id,
          quantity,
          unitPrice,
          discount,
          subtotal,
          beforeStock: currentStock,
          afterStock,
        };
      });

      const subtotal = saleItems.reduce(
        (total, item) =>
          total.add(item.subtotal),
        new Prisma.Decimal(0),
      );

      const saleDiscount = new Prisma.Decimal(
        data.discount,
      );

      if (saleDiscount.gt(subtotal)) {
        throw new AppError(
          "Sale discount cannot exceed subtotal",
          400,
        );
      }

      const totalAmount = subtotal.sub(
        saleDiscount,
      );

      const sale = await tx.sale.create({
        data: {
          customerId: data.customerId,
          userId: data.userId,
          saleDate: data.saleDate,
          subtotal,
          discount: saleDiscount,
          totalAmount,
          paymentMethod: data.paymentMethod,
          status: "COMPLETED",
        },
      });

      await tx.saleItem.createMany({
        data: saleItems.map((item) => ({
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          subtotal: item.subtotal,
        })),
      });

      for (const item of saleItems) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: item.afterStock,
          },
        });

        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            userId: data.userId,
            movementType: "OUT",
            referenceType: "SALE",
            referenceId: sale.id,
            quantity: item.quantity,
            beforeStock: item.beforeStock,
            afterStock: item.afterStock,
          },
        });
      }

      return tx.sale.findUnique({
        where: {
          id: sale.id,
        },
        include: {
          customer: true,
          user: {
            select: userSelect,
          },
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  }

  static async cancel(id: string) {
    return prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: {
          id,
        },
        include: {
          items: true,
        },
      });

      if (!sale) {
        throw new AppError(
          "Sale not found",
          404,
        );
      }

      if (sale.status !== "COMPLETED") {
        throw new AppError(
          "Only COMPLETED sales can be cancelled",
          400,
        );
      }

      for (const item of sale.items) {
        const product = await tx.product.findFirst({
          where: {
            id: item.productId,
            deletedAt: null,
          },
        });

        if (!product) {
          throw new AppError(
            `Product not found: ${item.productId}`,
            404,
          );
        }

        const quantity = new Prisma.Decimal(
          item.quantity,
        );

        const beforeStock = product.stock;
        const afterStock = beforeStock.add(quantity);

        await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            stock: afterStock,
          },
        });

        await tx.inventoryMovement.create({
          data: {
            productId: product.id,
            userId: sale.userId,
            movementType: "IN",
            referenceType: "SALE",
            referenceId: sale.id,
            quantity,
            beforeStock,
            afterStock,
            reason: "Sale cancellation",
          },
        });
      }

      await tx.sale.update({
        where: {
          id: sale.id,
        },
        data: {
          status: "CANCELLED",
        },
      });

      return tx.sale.findUnique({
        where: {
          id: sale.id,
        },
        include: {
          customer: true,
          user: {
            select: userSelect,
          },
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  }

  static async getAll(
    page = 1,
    limit = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      SaleRepository.findMany(
        skip,
        limit,
        search,
      ),
      SaleRepository.count(search),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  }

  static async getById(id: string) {
    const sale = await SaleRepository.findById(id);

    if (!sale) {
      throw new AppError(
        "Sale not found",
        404,
      );
    }

    return sale;
  }
}