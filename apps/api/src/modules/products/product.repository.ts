import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from '../../lib/prisma.js';

export class ProductRepository {
  static async create(data: {
    categoryId: string;
    name: string;
    sku: string;
    barcode?: string;
    purchasePrice: number;
    sellingPrice: number;
    stock: number;
    minimumStock: number;
    unit: string;
    imageUrl?: string;
    status: 'ACTIVE' | 'INACTIVE';
  }) {
    return prisma.product.create({
      data,
    });
  }

  static async findBySku(sku: string) {
    return prisma.product.findUnique({
      where: {
        sku,
      },
    });
  }

  static async findByBarcode(barcode: string) {
    return prisma.product.findUnique({
      where: {
        barcode,
      },
    });
  }

  static async findMany(
    skip: number,
    take: number,
    search?: string,
    categoryId?: string,
    status?: "ACTIVE" | "INACTIVE",
    stockStatus?: "LOW",
    sort: "name" | "sku" | "createdAt" = "createdAt",
    order: "asc" | "desc" = "desc",
  ) {
    let lowStockIds: string[] | undefined;

    if (stockStatus === "LOW") {
      const rows = await prisma.$queryRaw<
        Array<{ id: string }>
      >(Prisma.sql`
        SELECT id
        FROM "Product"
        WHERE stock <= "minimumStock"
          AND "deletedAt" IS NULL
      `);

      lowStockIds = rows.map((row) => row.id);
        
      if (lowStockIds.length === 0) {
        return [];
      }
    }

    return prisma.product.findMany({
      skip,
      take,

      where: {
        deletedAt: null,

        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  sku: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  barcode: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(categoryId
          ? { categoryId }
          : {}),

        ...(status
          ? { status }
          : {}),

        ...(lowStockIds
          ? {
              id: {
                in: lowStockIds,
              },
            }
          : {}),
      },

      orderBy: {
        [sort]: order,
      },

      include: {
        category: true,
      },
    });
  }

  static async count(
    search?: string,
    categoryId?: string,
    status?: "ACTIVE" | "INACTIVE",
    stockStatus?: "LOW",
  ) {
    if (stockStatus === "LOW") {
      const rows = await prisma.$queryRaw<
        Array<{ count: bigint }>
      >(Prisma.sql`
        SELECT COUNT(*)::bigint AS count
        FROM "Product"
        WHERE stock <= "minimumStock"
          AND "deletedAt" IS NULL
          ${
            categoryId
              ? Prisma.sql`AND "categoryId" = ${categoryId}`
              : Prisma.empty
          }
          ${
            status
              ? Prisma.sql`AND status = ${status}::"ProductStatus"`
              : Prisma.empty
          }
          ${
            search
              ? Prisma.sql`
                  AND (
                    name ILIKE ${`%${search}%`}
                    OR sku ILIKE ${`%${search}%`}
                    OR barcode ILIKE ${`%${search}%`}
                  )
                `
              : Prisma.empty
          }
      `);

      return Number(rows[0]?.count ?? 0);
    }

    return prisma.product.count({
      where: {
        deletedAt: null,

        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  sku: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  barcode: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(categoryId
          ? { categoryId }
          : {}),

        ...(status
          ? { status }
          : {}),
      },
    });
  }

  static async findById(id: string) {
    return prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        category: true,
      },
    });
  }

  static async update(
    id: string,
    data: {
      categoryId?: string;
      name?: string;
      sku?: string;
      barcode?: string;
      purchasePrice?: number;
      sellingPrice?: number;
      minimumStock?: number;
      unit?: string;
      status?: 'ACTIVE' | 'INACTIVE';
      imageUrl?: string;
    },
  ) {
    return prisma.product.update({
      where: {
        id,
      },
      data,
      include: {
        category: true,
      },
    });
  }

  static async softDelete(id: string) {
    return prisma.product.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}