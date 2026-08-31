import type { Prisma } from "../../generated/prisma/client.js";

import { prisma } from "../../lib/prisma.js";

export class SettingRepository {
  static async findMany() {
    return prisma.setting.findMany({
      orderBy: {
        key: "asc",
      },
    });
  }

  static async upsert(
    key: string,
    value: string,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.setting.upsert({
      where: { key },
      update: { value },
      create: {
        key,
        value,
      },
    });
  }
}