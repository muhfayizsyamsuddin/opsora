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
    return prisma.product.findFirst({
      where: {
        sku,
        deletedAt: null,
      },
    });
  }

  static async findByBarcode(barcode: string) {
    return prisma.product.findFirst({
      where: {
        barcode,
        deletedAt: null,
      },
    });
  }

  static async findMany(
    skip: number,
    take: number,
    search?: string,
    categoryId?: string,
    status?: 'ACTIVE' | 'INACTIVE',
    sort: 'name' | 'sku' | 'createdAt' = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
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
                    mode: 'insensitive',
                  },
                },
                {
                  sku: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  barcode: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(status ? { status } : {}),
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
    status?: 'ACTIVE' | 'INACTIVE',
  ) {
    return prisma.product.count({
      where: {
        deletedAt: null,
        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  sku: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  barcode: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(status ? { status } : {}),
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