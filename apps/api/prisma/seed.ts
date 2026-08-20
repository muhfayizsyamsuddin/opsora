import { prisma } from "../src/lib/prisma.js";
import bcrypt from "bcrypt";

type RolePermissionMap = Record<string, string[]>;

const roles = [
  {
    name: "SUPER_ADMIN",
    description: "Full system and business access",
  },
  {
    name: "OWNER",
    description: "Read-only business oversight",
  },
  {
    name: "ADMIN",
    description: "Operational and business data management",
  },
  {
    name: "MANAGER",
    description: "Business and operational supervision",
  },
  {
    name: "STAFF",
    description: "Daily operational activities",
  },
  {
    name: "CASHIER",
    description: "Sales-focused operational access",
  },
];

const permissions = [
  // Products
  ["products.read", "View products"],
  ["products.create", "Create products"],
  ["products.update", "Update products"],
  ["products.delete", "Delete products"],

  // Categories
  ["categories.read", "View categories"],
  ["categories.create", "Create categories"],
  ["categories.update", "Update categories"],
  ["categories.delete", "Delete categories"],

  // Suppliers
  ["suppliers.read", "View suppliers"],
  ["suppliers.create", "Create suppliers"],
  ["suppliers.update", "Update suppliers"],
  ["suppliers.delete", "Delete suppliers"],

  // Customers
  ["customers.read", "View customers"],
  ["customers.create", "Create customers"],
  ["customers.update", "Update customers"],
  ["customers.delete", "Delete customers"],

  // Purchases
  ["purchases.read", "View purchases"],
  ["purchases.create", "Create purchases"],
  ["purchases.complete", "Complete purchases"],
  ["purchases.cancel", "Cancel purchases"],

  // Payroll
  ["payroll.read", "View payroll"],
  ["payroll.create", "Create payroll"],
  ["payroll.delete", "Delete payroll"],

  // Sales
  ["sales.read", "View sales"],
  ["sales.create", "Create sales"],
  ["sales.cancel", "Cancel sales"],

  // Inventory Movements
  ["inventory-movements.read", "View inventory movements"],
  ["inventory-movements.adjust", "Adjust inventory movements"],

  // Dashboard / Reports
  ["dashboard.read", "View dashboard"],
  ["reports.read", "View reports"],

  // Employees
  ["employees.read", "View employees"],
  ["employees.create", "Create employees"],
  ["employees.update", "Update employees"],
  ["employees.delete", "Delete employees"],

  // Departments
  ["departments.read", "View departments"],
  ["departments.create", "Create departments"],
  ["departments.update", "Update departments"],
  ["departments.delete", "Delete departments"],

  // Attendance
  ["attendances.read", "View attendance"],
  ["attendances.create", "Create attendance"],
  ["attendances.update", "Update attendance"],

  // Leave
  ["leaves.read", "View leave requests"],
  ["leaves.create", "Create leave requests"],
  ["leaves.approve", "Approve leave requests"],
  ["leaves.reject", "Reject leave requests"],

  // Performance Reviews
  ["performance_reviews.read", "View performance reviews"],
  ["performance_reviews.create", "Create performance reviews"],
  ["performance_reviews.update", "Update performance reviews"],
  ["performance_reviews.delete", "Delete performance reviews"],

  // Users
  ["users.read", "View users"],
  ["users.create", "Create users"],
  ["users.update", "Update users"],
  ["users.delete", "Delete users"],

  // Roles
  ["roles.read", "View roles"],
  ["roles.create", "Create roles"],
  ["roles.update", "Update roles"],
  ["roles.delete", "Delete roles"],

  // Permissions
  ["permissions.read", "View permissions"],
  ["permissions.create", "Create permissions"],
  ["permissions.update", "Update permissions"],
  ["permissions.delete", "Delete permissions"],

  // System configuration
  ["settings.read", "View system configuration"],
  ["settings.update", "Update system configuration"],
] as const;

const defaultSettings = [
  ["company.name", ""],
  ["company.logo", ""],
  ["company.phone", ""],
  ["company.email", ""],
  ["company.address", ""],

  ["system.theme", "light"],
  ["system.currency", "IDR"],
  ["system.dateFormat", "DD/MM/YYYY"],
  ["system.timeFormat", "24h"],
] as const;

const operationalAdminPermissions = permissions
  .map(([name]) => name)
  .filter(
    (name) =>
      !name.startsWith("users.") &&
      !name.startsWith("roles.") &&
      !name.startsWith("permissions.") &&
      !name.startsWith("settings."),
  );

const rolePermissions: RolePermissionMap = {
  SUPER_ADMIN: permissions.map(([name]) => name),

  OWNER: [
    "dashboard.read",
    "reports.read",
    "inventory-movements.read",
    "sales.read",
    "purchases.read",
    "products.read",
    "customers.read",
    "suppliers.read",
    "employees.read",
    "departments.read",
    "attendances.read",
    "leaves.read",
    "performance_reviews.read",
  ],

  ADMIN: [
    ...operationalAdminPermissions,
  ],

  MANAGER: [
    "dashboard.read",
    "reports.read",

    "products.read",
    "categories.read",
    "suppliers.read",
    "customers.read",
    "inventory-movements.read",

    "sales.read",
    "purchases.read",

    "employees.read",
    "departments.read",
    "attendances.read",
    "leaves.read",
    "leaves.approve",
    "leaves.reject",
    "performance_reviews.read",
  ],

  STAFF: [
    "products.read",
    "inventory-movements.read",

    "purchases.read",
    "purchases.create",
    "purchases.complete",

    "sales.read",
    "sales.create",

    "customers.read",
    "suppliers.read",

    "attendances.read",
    "attendances.create",
    "attendances.update",
  ],

  CASHIER: [
    "products.read",
    "customers.read",
    "sales.read",
    "sales.create",
  ],
};

async function seed() {
  console.log("Seeding RBAC...");

  const permissionMap = new Map<string, string>();

  for (const [name, description] of permissions) {
    const permission = await prisma.permission.upsert({
      where: { name },
      update: {
        description,
      },
      create: {
        name,
        description,
      },
    });

    permissionMap.set(permission.name, permission.id);
  }

  const roleMap = new Map<string, string>();

  for (const role of roles) {
    const createdRole = await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        description: role.description,
      },
      create: {
        name: role.name,
        description: role.description,
      },
    });

    roleMap.set(createdRole.name, createdRole.id);
  }

  async function upsertTestUser(
    email: string,
    name: string,
    roleId: string,
  ) {
    const password = await bcrypt.hash(
      "opsora12345",
      10,
    );

    await prisma.user.upsert({
      where: { email },
      update: {
        name,
        password,
        roleId,
      },
      create: {
        name,
        email,
        password,
        roleId,
      },
    });
  }

  const ownerRoleId = roleMap.get("OWNER");
  const adminRoleId = roleMap.get("ADMIN");
  const managerRoleId = roleMap.get("MANAGER");
  const staffRoleId = roleMap.get("STAFF");
  const superAdminRoleId = roleMap.get("SUPER_ADMIN");
  const cashierRoleId = roleMap.get("CASHIER");

  if (
    !ownerRoleId ||
    !adminRoleId ||
    !managerRoleId ||
    !staffRoleId ||
    !superAdminRoleId ||
    !cashierRoleId
  ) {
    throw new Error("Required RBAC roles not found");
  }

  await upsertTestUser(
    "superadmin@opsora.test",
    "Super Admin Test",
    superAdminRoleId,
  );

  await upsertTestUser(
    "owner@opsora.test",
    "Owner Test",
    ownerRoleId,
  );

  await upsertTestUser(
    "admin@opsora.test",
    "Admin Test",
    adminRoleId,
  );

  await upsertTestUser(
    "manager@opsora.test",
    "Manager Test",
    managerRoleId,
  );

  await upsertTestUser(
    "staff@opsora.test",
    "Staff Test",
    staffRoleId,
  );

  await upsertTestUser(
    "cashier@opsora.test",
    "Cashier Test",
    cashierRoleId,
  );

  for (const [key, value] of defaultSettings) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: {
        key,
        value,
      },
    });
  }

  for (const [roleName, permissionNames] of Object.entries(
    rolePermissions,
  )) {
    const roleId = roleMap.get(roleName);

    if (!roleId) {
      throw new Error(`Role not found: ${roleName}`);
    }

    for (const permissionName of permissionNames) {
      const permissionId =
        permissionMap.get(permissionName);

      if (!permissionId) {
        throw new Error(
          `Permission not found: ${permissionName}`,
        );
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId,
          permissionId,
        },
      });
    }
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      roleId: true,
    },
  });

  console.log("Users after RBAC backfill:");

  for (const user of users) {
    console.log({
      id: user.id,
      email: user.email,
      roleId: user.roleId,
    });
  }

  console.log("RBAC seed completed successfully.");
}

seed()
  .catch((error) => {
    console.error("RBAC seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });