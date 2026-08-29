import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../errors/AppError.js";
import { Prisma } from "../../generated/prisma/client.js";
import { SaleRepository } from "./sale.repository.js";
import { InventoryStockService } from "../inventory-movements/inventory-stock.service.js";

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
  roleId: true,
  isActive: true,
  roleRef: {
    select: {
      id: true,
      name: true,
      description: true,
    },
  },
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

      const uniqueProductIds =
        new Set(productIds);

      if (
        uniqueProductIds.size !==
        productIds.length
      ) {
        throw new AppError(
          "Sale cannot contain duplicate products",
          400,
        );
      }

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
        return {
          product,
          productId: product.id,
          quantity,
          unitPrice,
          discount,
          subtotal,
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

      const cancelResult =
        await tx.sale.updateMany({
          where: {
            id: sale.id,
            status: "PENDING",
          },
          data: {
            status: "CANCELLED",
          },
        });

      if (cancelResult.count !== 1) {
        throw new AppError(
          "Only PENDING sales can be cancelled",
          400,
        );
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

  static async getAll(query: {
    page?: number;
    perPage?: number;
    search?: string;
    customerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: "saleDate" | "createdAt" | "totalAmount";
    sortOrder?: "asc" | "desc";
  }) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;

    const skip = (page - 1) * perPage;

    const result = await SaleRepository.findMany(
      skip,
      perPage,
      query.search,
      query.customerId,
      query.dateFrom,
      query.dateTo,
      query.sortBy ?? "saleDate",
      query.sortOrder ?? "desc",
    );

    const total = await SaleRepository.count(
      query.search,
      query.customerId,
      query.dateFrom,
      query.dateTo,
    );

    return {
      data: result,
      meta: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(
          total / perPage,
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

  static async pay(id: string) {
    return prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id },
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

      const payResult = await tx.sale.updateMany({
        where: {
          id: sale.id,
          status: "PENDING",
        },
        data: {
          status: "COMPLETED",
        },
      });

      if (payResult.count !== 1) {
        throw new AppError(
          "Only PENDING sales can be paid",
          400,
        );
      }

      for (const item of sale.items) {
        const stockChange =
          await InventoryStockService.decreaseStock(
            tx,
            item.productId,
            item.quantity,
          );

        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            userId: sale.userId,
            movementType: "OUT",
            referenceType: "SALE",
            referenceId: sale.id,
            quantity: item.quantity,
            beforeStock: stockChange.beforeStock,
            afterStock: stockChange.afterStock,
          },
        });
      }

      return tx.sale.findUnique({
        where: { id: sale.id },
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

  static async update(
    id: string,
    data: {
      customerId?: string | null;
      saleDate?: Date;
      paymentMethod?: PaymentMethod;
      discount?: number;
      items?: SaleItemInput[];
    },
  ) {
    return prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id },
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

      const pendingClaim =
        await tx.sale.updateMany({
          where: {
            id: sale.id,
            status: "PENDING",
          },
          data: {
            updatedAt: new Date(),
          },
        });

      if (pendingClaim.count !== 1) {
        throw new AppError(
          "Only PENDING sales can be updated",
          400,
        );
      }

      if (data.customerId !== undefined) {
        if (data.customerId) {
          const customer =
            await tx.customer.findFirst({
              where: {
                id: data.customerId,
                deletedAt: null,
              },
            });

          if (!customer) {
            throw new AppError(
              "Customer not found",
              404,
            );
          }
        }
      }

      let subtotal = sale.subtotal;
      let discount = sale.discount;
      let totalAmount = sale.totalAmount;

      if (data.items) {
        const productIds = data.items.map(
          (item) => item.productId,
        );

        const uniqueProductIds =
          new Set(productIds);

        if (
          uniqueProductIds.size !==
          productIds.length
        ) {
          throw new AppError(
            "Sale cannot contain duplicate products",
            400,
          );
        }

        const products =
          await tx.product.findMany({
            where: {
              id: {
                in: productIds,
              },
              deletedAt: null,
              status: "ACTIVE",
            },
          });

        if (
          products.length !== productIds.length
        ) {
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

        const saleItems = data.items.map(
          (item) => {
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
            const product =
              productMap.get(item.productId);

            if (!product) {
              throw new AppError(
                "Product not found",
                404,
              );
            }

            const quantity =
              new Prisma.Decimal(item.quantity);

            const unitPrice =
              product.sellingPrice;

            const itemDiscount =
              new Prisma.Decimal(item.discount);

            const gross =
              quantity.mul(unitPrice);

            if (itemDiscount.gt(gross)) {
              throw new AppError(
                "Item discount cannot exceed item gross amount",
                400,
              );
            }

            const itemSubtotal =
              gross.sub(itemDiscount);

            return {
              productId: product.id,
              quantity,
              unitPrice,
              discount: itemDiscount,
              subtotal: itemSubtotal,
            };
          },
        );

        subtotal = saleItems.reduce(
          (sum, item) =>
            sum.add(item.subtotal),
          new Prisma.Decimal(0),
        );

        discount =
          data.discount !== undefined
            ? new Prisma.Decimal(data.discount)
            : sale.discount;

        if (discount.gt(subtotal)) {
          throw new AppError(
            "Sale discount cannot exceed subtotal",
            400,
          );
        }

        totalAmount =
          subtotal.sub(discount);

        await tx.saleItem.deleteMany({
          where: {
            saleId: id,
          },
        });

        await tx.saleItem.createMany({
          data: saleItems.map((item) => ({
            saleId: id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            subtotal: item.subtotal,
          })),
        });
      } else if (data.discount !== undefined) {
        discount = new Prisma.Decimal(
          data.discount,
        );

        if (discount.gt(subtotal)) {
          throw new AppError(
            "Sale discount cannot exceed subtotal",
            400,
          );
        }

        totalAmount =
          subtotal.sub(discount);
      }

      await tx.sale.update({
        where: { id },
        data: {
          customerId:
            data.customerId !== undefined
              ? data.customerId
              : sale.customerId,
          saleDate:
            data.saleDate ?? sale.saleDate,
          paymentMethod:
            data.paymentMethod ??
            sale.paymentMethod,
          subtotal,
          discount,
          totalAmount,
        },
      });

      return tx.sale.findUnique({
        where: { id },
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
  
  static async getInvoice(id: string) {
    const sale = await SaleRepository.findById(id);

    if (!sale) {
      throw new AppError(
        "Sale not found",
        404,
      );
    }

    if (sale.status !== "COMPLETED") {
      throw new AppError(
        "Invoice is only available for completed sales",
        400,
      );
    }

    return {
      invoiceNumber: `INV-${sale.id.slice(0, 8).toUpperCase()}`,
      saleId: sale.id,
      saleDate: sale.saleDate,
      paymentMethod: sale.paymentMethod,
      customer: sale.customer
        ? {
            id: sale.customer.id,
            name: sale.customer.name,
          }
        : null,
      cashier: {
        id: sale.user.id,
        name: sale.user.name,
        email: sale.user.email,
      },
      items: sale.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        subtotal: item.subtotal,
      })),
      subtotal: sale.subtotal,
      discount: sale.discount,
      totalAmount: sale.totalAmount,
      status: sale.status,
    };
  }
}