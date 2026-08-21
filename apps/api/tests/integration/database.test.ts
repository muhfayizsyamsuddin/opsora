import { describe, expect, it } from "vitest";
import { prisma } from "../../src/lib/prisma.js";

describe("Test database", () => {
  it("connects to the test database", async () => {
    const result = await prisma.$queryRaw<
      Array<{ database: string }>
    >`
      SELECT current_database() AS database
    `;

    expect(result[0]?.database).toBe("opsora_test");
  });
});