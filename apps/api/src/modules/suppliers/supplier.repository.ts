import { prisma } from '../../lib/prisma.js';

export class SupplierRepository {
  static async create(data: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  }) {
    return prisma.supplier.create({
      data,
    });
  }

  static async findById(id: string) {
    return prisma.supplier.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  static async findByName(name: string) {
    return prisma.supplier.findFirst({
      where: {
        name,
        deletedAt: null,
      },
    });
  }

  static async findMany(
    skip: number,
    take: number,
    search?: string,
    sort: 'name' | 'createdAt' = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    return prisma.supplier.findMany({
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
                  phone: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: {
        [sort]: order,
      },
    });
  }

  static async count(search?: string) {
    return prisma.supplier.count({
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
                  phone: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
    });
  }

  static async update(
    id: string,
    data: {
      name?: string;
      phone?: string;
      email?: string;
      address?: string;
    },
  ) {
    return prisma.supplier.update({
      where: {
        id,
      },
      data,
    });
  }

  static async softDelete(id: string) {
    return prisma.supplier.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}