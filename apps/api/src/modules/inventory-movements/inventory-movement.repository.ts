import { prisma } from "../../lib/prisma.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export class InventoryMovementRepository {
  static async create(data: {
    productId: string;
    userId: string;
    movementType: "IN" | "OUT";
    referenceType: "PURCHASE" | "SALE" | "ADJUSTMENT";
    referenceId?: string;
    quantity: number;
    beforeStock: number;
    afterStock: number;
    reason?: string;
  }) {
    return prisma.inventoryMovement.create({
      data,
    });
  }

  static async findById(id: string) {
    return prisma.inventoryMovement.findUnique({
      where: { id },
      include: {
        product: true,
        user: {
          select: userSelect,
        },
      },
    });
  }

  static async findMany(
    skip: number,
    take: number,
    productId?: string,
    movementType?: "IN" | "OUT",
    referenceType?: "PURCHASE" | "SALE" | "ADJUSTMENT",
  ) {
    return prisma.inventoryMovement.findMany({
      skip,
      take,
      where: {
        ...(productId ? { productId } : {}),
        ...(movementType ? { movementType } : {}),
        ...(referenceType ? { referenceType } : {}),
      },
      include: {
        product: true,
        user: {
          select: userSelect,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async count(
    productId?: string,
    movementType?: "IN" | "OUT",
    referenceType?: "PURCHASE" | "SALE" | "ADJUSTMENT",
  ) {
    return prisma.inventoryMovement.count({
      where: {
        ...(productId ? { productId } : {}),
        ...(movementType ? { movementType } : {}),
        ...(referenceType ? { referenceType } : {}),
      },
    });
  }
}