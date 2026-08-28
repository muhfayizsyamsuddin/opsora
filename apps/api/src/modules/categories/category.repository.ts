import { prisma } from '../../lib/prisma.js';

export class CategoryRepository {
  static async create(data: {
    name: string;
    description?: string;
  }) {
    return prisma.category.create({
      data,
    });
  }

  static async findByName(name: string) {
    return prisma.category.findUnique({
      where: {
        name,
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
    return prisma.category.findMany({
      skip,
      take,
      where: {
        deletedAt: null,
        ...(search
          ? {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      orderBy: {
        [sort]: order,
      },
    });
  }

  static async count(search?: string) {
    return prisma.category.count({
      where: {
        deletedAt: null,
        ...(search
          ? {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
    });
  }

  static async findById(id: string) {
    return prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  static async update(
    id: string,
    data: {
      name?: string;
      description?: string;
    },
  ) {
    return prisma.category.update({
      where: {
        id,
      },
      data,
    });
  }

  static async softDelete(id: string) {
    return prisma.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}