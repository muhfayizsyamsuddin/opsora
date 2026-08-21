import { prisma } from "../../lib/prisma.js";

export class InventoryRepository {
  static async findStock(
    page: number,
    perPage: number,
    search?: string,
    sortBy: "name" | "createdAt" = "name",
    sortOrder: "asc" | "desc" = "asc",
  ) {
    const skip = (page - 1) * perPage;

    const where = {
      status: "ACTIVE" as const,
      deletedAt: null,

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                sku: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: perPage,
        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
          minimumStock: true,
          unit: true,
          status: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),

      prisma.product.count({
        where,
      }),
    ]);

    return {
      data,
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

  static async findStockByProductId(
    productId: string,
  ) {
    return prisma.product.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        minimumStock: true,
        unit: true,
        status: true,
      },
    });
  }

  static async findMovements(
    page: number,
    limit: number,
    productId?: string,
    movementType?: "IN" | "OUT",
    referenceType?: "PURCHASE" | "SALE" | "ADJUSTMENT",
  ) {
    const skip = (page - 1) * limit;

    const where = {
      ...(productId ? { productId } : {}),
      ...(movementType ? { movementType } : {}),
      ...(referenceType ? { referenceType } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.inventoryMovement.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.inventoryMovement.count({
        where,
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}