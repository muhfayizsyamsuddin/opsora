import { prisma } from "../src/lib/prisma.js";
import { PurchaseService } from "../src/modules/purchases/purchase.service.js";
import { SaleService } from "../src/modules/sales/sale.service.js";
import { PurchaseReturnService } from "../src/modules/purchase-returns/purchase-return.service.js";
import { SaleReturnService } from "../src/modules/sales-returns/sale-return.service.js";
import { AttendanceService } from "../src/modules/attendances/attendance.service.js";
import { LeaveService } from "../src/modules/leaves/leave.service.js";
import { PerformanceReviewService } from "../src/modules/performance-reviews/performance-review.service.js";
import { PayrollService } from "../src/modules/payroll/payroll.service.js";

async function seedDemo() {
  console.log("Seeding demo data...");

  const categories = [
    {
      name: "Electronics",
      description: "Electronic devices and accessories",
    },
    {
      name: "Office Supplies",
      description: "Office and stationery supplies",
    },
    {
      name: "Accessories",
      description: "Computer and mobile accessories",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        name: category.name,
      },
      update: {
        description: category.description,
      },
      create: category,
    });
  }

  const suppliers = [
    {
      name: "PT Nusantara Elektronik",
      email: "sales@nusantara-electronics.demo",
      phone: "081200000001",
      address: "Jakarta, Indonesia",
    },
    {
      name: "CV Sumber Office",
      email: "sales@sumber-office.demo",
      phone: "081200000002",
      address: "Bandung, Indonesia",
    },
  ];

  for (const supplier of suppliers) {
    const existingSupplier =
      await prisma.supplier.findFirst({
        where: {
          email: supplier.email,
          deletedAt: null,
        },
      });

    if (existingSupplier) {
      await prisma.supplier.update({
        where: {
          id: existingSupplier.id,
        },
        data: {
          name: supplier.name,
          phone: supplier.phone,
          address: supplier.address,
        },
      });
    } else {
      await prisma.supplier.create({
        data: supplier,
      });
    }
  }

  const customers = [
    {
      name: "Andi Pratama",
      email: "andi.pratama@demo.opsora",
      phone: "081300000001",
      address: "Makassar, Indonesia",
    },
    {
      name: "Siti Rahma",
      email: "siti.rahma@demo.opsora",
      phone: "081300000002",
      address: "Makassar, Indonesia",
    },
    {
      name: "CV Maju Jaya",
      email: "purchasing@majujaya.demo",
      phone: "081300000003",
      address: "Gowa, Indonesia",
    },
  ];

  for (const customer of customers) {
    const existingCustomer =
      await prisma.customer.findFirst({
        where: {
          email: customer.email,
          deletedAt: null,
        },
      });

    if (existingCustomer) {
      await prisma.customer.update({
        where: {
          id: existingCustomer.id,
        },
        data: {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
        },
      });
    } else {
      await prisma.customer.create({
        data: customer,
      });
    }
  }

  const electronicsCategory =
    await prisma.category.findUniqueOrThrow({
      where: {
        name: "Electronics",
      },
    });

  const officeSuppliesCategory =
    await prisma.category.findUniqueOrThrow({
      where: {
        name: "Office Supplies",
      },
    });

  const accessoriesCategory =
    await prisma.category.findUniqueOrThrow({
      where: {
        name: "Accessories",
      },
    });

  const products = [
    {
      name: "Wireless Mouse",
      sku: "DEMO-MOUSE-001",
      barcode: "8990000000011",
      purchasePrice: 85000,
      sellingPrice: 125000,
      stock: 0,
      minimumStock: 5,
      unit: "pcs",
      categoryId: accessoriesCategory.id,
    },
    {
      name: "Mechanical Keyboard",
      sku: "DEMO-KEYBOARD-001",
      barcode: "8990000000028",
      purchasePrice: 275000,
      sellingPrice: 375000,
      stock: 0,
      minimumStock: 3,
      unit: "pcs",
      categoryId: electronicsCategory.id,
    },
    {
      name: "USB-C Hub 6-in-1",
      sku: "DEMO-HUB-001",
      barcode: "8990000000035",
      purchasePrice: 185000,
      sellingPrice: 265000,
      stock: 0,
      minimumStock: 4,
      unit: "pcs",
      categoryId: accessoriesCategory.id,
    },
    {
      name: "A4 Copy Paper 80gsm",
      sku: "DEMO-PAPER-001",
      barcode: "8990000000042",
      purchasePrice: 48000,
      sellingPrice: 65000,
      stock: 0,
      minimumStock: 10,
      unit: "ream",
      categoryId: officeSuppliesCategory.id,
    },
    {
      name: "Black Printer Ink",
      sku: "DEMO-INK-001",
      barcode: "8990000000059",
      purchasePrice: 95000,
      sellingPrice: 135000,
      stock: 0,
      minimumStock: 5,
      unit: "pcs",
      categoryId: officeSuppliesCategory.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        sku: product.sku,
      },
      update: {
        name: product.name,
        barcode: product.barcode,
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        minimumStock: product.minimumStock,
        unit: product.unit,
        categoryId: product.categoryId,
      },
      create: product,
    });
  }

  console.log("Demo products seeded.");

  const demoAdmin =
    await prisma.user.findFirst({
      where: {
        roleRef: {
          name: "SUPER_ADMIN",
        },
        isActive: true,
      },
    });

  if (!demoAdmin) {
    throw new Error(
      "Active SUPER_ADMIN user is required for demo purchases",
    );
  }

  const demoSupplier =
    await prisma.supplier.findFirst({
      where: {
        email: "sales@nusantara-electronics.demo",
        deletedAt: null,
      },
    });

  if (!demoSupplier) {
    throw new Error("Demo supplier not found");
  }

  const demoMouse =
    await prisma.product.findUniqueOrThrow({
      where: {
        sku: "DEMO-MOUSE-001",
      },
    });

  const demoKeyboard =
    await prisma.product.findUniqueOrThrow({
      where: {
        sku: "DEMO-KEYBOARD-001",
      },
    });

  const demoPurchaseDate =
    new Date("2026-08-20T09:00:00.000Z");

  let seededDemoPurchase =
    await prisma.purchase.findFirst({
      where: {
        supplierId: demoSupplier.id,
        userId: demoAdmin.id,
        purchaseDate: demoPurchaseDate,
      },
    });

  if (!seededDemoPurchase) {
    seededDemoPurchase =
      await PurchaseService.create({
        supplierId: demoSupplier.id,
        userId: demoAdmin.id,
        purchaseDate: demoPurchaseDate,
        items: [
          {
            productId: demoMouse.id,
            quantity: 20,
            unitPrice: 85000,
          },
          {
            productId: demoKeyboard.id,
            quantity: 10,
            unitPrice: 275000,
          },
        ],
      });

    if (!seededDemoPurchase) {
      throw new Error(
        "Failed to create demo purchase",
      );
    }
  }

  if (seededDemoPurchase.status === "DRAFT") {
    await PurchaseService.complete(
      seededDemoPurchase.id,
    );

    console.log(
      "Demo purchase created/completed.",
    );
  } else if (
    seededDemoPurchase.status === "COMPLETED"
  ) {
    console.log(
      "Demo purchase already completed.",
    );
  } else {
    throw new Error(
      `Unexpected demo purchase status: ${seededDemoPurchase.status}`,
    );
  }

  const demoCustomer =
    await prisma.customer.findFirst({
      where: {
        email: "andi.pratama@demo.opsora",
        deletedAt: null,
      },
    });

  if (!demoCustomer) {
    throw new Error("Demo customer not found");
  }

  const demoSaleDate = new Date("2026-08-25T10:00:00.000Z");

  let seededDemoSale =
    await prisma.sale.findFirst({
      where: {
        customerId: demoCustomer.id,
        userId: demoAdmin.id,
        saleDate: demoSaleDate,
      },
    });

  if (!seededDemoSale) {
    seededDemoSale =
      await SaleService.create({
        customerId: demoCustomer.id,
        userId: demoAdmin.id,
        saleDate: demoSaleDate,
        paymentMethod: "QRIS",
        discount: 0,
        items: [
          {
            productId: demoMouse.id,
            quantity: 3,
            discount: 0,
          },
          {
            productId: demoKeyboard.id,
            quantity: 2,
            discount: 0,
          },
        ],
      });

    if (!seededDemoSale) {
      throw new Error(
        "Failed to create demo sale",
      );
    }
  }

  if (seededDemoSale.status === "PENDING") {
    await SaleService.pay(
      seededDemoSale.id,
    );

    console.log(
      "Demo sale created/completed.",
    );
  } else if (
    seededDemoSale.status === "COMPLETED"
  ) {
    console.log(
      "Demo sale already completed.",
    );
  } else {
    throw new Error(
      `Unexpected demo sale status: ${seededDemoSale.status}`,
    );
  }

  const demoPurchase =
    await prisma.purchase.findFirst({
      where: {
        supplierId: demoSupplier.id,
        userId: demoAdmin.id,
        purchaseDate: demoPurchaseDate,
      },
      include: {
        items: true,
      },
    });

  if (!demoPurchase) {
    throw new Error("Demo purchase not found");
  }

  const demoPurchaseKeyboardItem =
    demoPurchase.items.find(
      (item) =>
        item.productId === demoKeyboard.id,
    );

  if (!demoPurchaseKeyboardItem) {
    throw new Error(
      "Demo keyboard purchase item not found",
    );
  }

  const demoPurchaseReturnDate =
    new Date("2026-08-27T09:00:00.000Z");

  let seededDemoPurchaseReturn =
    await prisma.purchaseReturn.findFirst({
      where: {
        purchaseId: demoPurchase.id,
        userId: demoAdmin.id,
        returnDate: demoPurchaseReturnDate,
      },
    });

  if (!seededDemoPurchaseReturn) {
    seededDemoPurchaseReturn =
      await PurchaseReturnService.create({
        purchaseId: demoPurchase.id,
        userId: demoAdmin.id,
        returnDate: demoPurchaseReturnDate,
        reason: "Damaged item from supplier",
        items: [
          {
            purchaseItemId:
              demoPurchaseKeyboardItem.id,
            quantity: 1,
          },
        ],
      });
  }

  if (
    seededDemoPurchaseReturn.status === "DRAFT"
  ) {
    await PurchaseReturnService.complete(
      seededDemoPurchaseReturn.id,
    );

    console.log(
      "Demo purchase return created/completed.",
    );
  } else if (
    seededDemoPurchaseReturn.status === "COMPLETED"
  ) {
    console.log(
      "Demo purchase return already completed.",
    );
  } else {
    throw new Error(
      `Unexpected demo purchase return status: ${seededDemoPurchaseReturn.status}`,
    );
  }

  const demoSale =
    await prisma.sale.findFirst({
      where: {
        customerId: demoCustomer.id,
        userId: demoAdmin.id,
        saleDate: demoSaleDate,
      },
      include: {
        items: true,
      },
    });

  if (!demoSale) {
    throw new Error("Demo sale not found");
  }

  const demoSaleMouseItem =
    demoSale.items.find(
      (item) =>
        item.productId === demoMouse.id,
    );

  if (!demoSaleMouseItem) {
    throw new Error(
      "Demo mouse sale item not found",
    );
  }

  const demoSaleReturnDate =
    new Date("2026-08-29T11:00:00.000Z");

  let seededDemoSaleReturn =
    await prisma.saleReturn.findFirst({
      where: {
        saleId: demoSale.id,
        userId: demoAdmin.id,
        returnDate: demoSaleReturnDate,
      },
    });

  if (!seededDemoSaleReturn) {
    seededDemoSaleReturn =
      await SaleReturnService.create({
        saleId: demoSale.id,
        userId: demoAdmin.id,
        returnDate: demoSaleReturnDate,
        reason: "Customer returned item",
        items: [
          {
            saleItemId: demoSaleMouseItem.id,
            quantity: 1,
          },
        ],
      });
  }

  if (seededDemoSaleReturn.status === "DRAFT") {
    await SaleReturnService.complete(
      seededDemoSaleReturn.id,
    );

    console.log(
      "Demo sale return created/completed.",
    );
  } else if (
    seededDemoSaleReturn.status === "COMPLETED"
  ) {
    console.log(
      "Demo sale return already completed.",
    );
  } else {
    throw new Error(
      `Unexpected demo sale return status: ${seededDemoSaleReturn.status}`,
    );
  }

  const departments = [
    {
      name: "Operations",
    },
    {
      name: "Finance",
    },
    {
      name: "Human Resources",
    },
  ];

  for (const department of departments) {
    await prisma.department.upsert({
      where: {
        name: department.name,
      },
      update: {},
      create: department,
    });
  }

  const operationsDepartment =
    await prisma.department.findUniqueOrThrow({
      where: {
        name: "Operations",
      },
    });

  const financeDepartment =
    await prisma.department.findUniqueOrThrow({
      where: {
        name: "Finance",
      },
    });

  const hrDepartment =
    await prisma.department.findUniqueOrThrow({
      where: {
        name: "Human Resources",
      },
    });

  const employees = [
    {
      employeeCode: "DEMO-EMP-001",
      name: "Rizky Maulana",
      email: "rizky.maulana@demo.opsora",
      position: "Operations Staff",
      salary: 5500000,
      hireDate: new Date("2025-02-03T00:00:00.000Z"),
      departmentId: operationsDepartment.id,
    },
    {
      employeeCode: "DEMO-EMP-002",
      name: "Nadia Putri",
      email: "nadia.putri@demo.opsora",
      position: "Finance Officer",
      salary: 6500000,
      hireDate: new Date("2024-11-11T00:00:00.000Z"),
      departmentId: financeDepartment.id,
    },
    {
      employeeCode: "DEMO-EMP-003",
      name: "Farhan Akbar",
      email: "farhan.akbar@demo.opsora",
      position: "HR Officer",
      salary: 6000000,
      hireDate: new Date("2025-01-06T00:00:00.000Z"),
      departmentId: hrDepartment.id,
    },
  ];

  for (const employee of employees) {
    await prisma.employee.upsert({
      where: {
        employeeCode: employee.employeeCode,
      },
      update: {
        name: employee.name,
        email: employee.email,
        position: employee.position,
        salary: employee.salary,
        hireDate: employee.hireDate,
        departmentId: employee.departmentId,
        status: "ACTIVE",
      },
      create: {
        ...employee,
        status: "ACTIVE",
      },
    });
  }

  const rizky =
    await prisma.employee.findUniqueOrThrow({
      where: {
        employeeCode: "DEMO-EMP-001",
      },
    });

  const nadia =
    await prisma.employee.findUniqueOrThrow({
      where: {
        employeeCode: "DEMO-EMP-002",
      },
    });

  const farhan =
    await prisma.employee.findUniqueOrThrow({
      where: {
        employeeCode: "DEMO-EMP-003",
      },
    });

  console.log("Demo departments and employees seeded.");

  const attendanceSeeds = [
    {
      employeeId: rizky.id,
      checkIn: new Date("2026-08-25T08:02:00.000Z"),
      checkOut: new Date("2026-08-25T17:05:00.000Z"),
      status: "PRESENT" as const,
    },
    {
      employeeId: nadia.id,
      checkIn: new Date("2026-08-25T08:20:00.000Z"),
      checkOut: new Date("2026-08-25T17:10:00.000Z"),
      status: "LATE" as const,
    },
    {
      employeeId: farhan.id,
      checkIn: new Date("2026-08-25T07:55:00.000Z"),
      checkOut: new Date("2026-08-25T16:58:00.000Z"),
      status: "PRESENT" as const,
    },
    {
      employeeId: rizky.id,
      checkIn: new Date("2026-08-26T08:00:00.000Z"),
      checkOut: new Date("2026-08-26T17:02:00.000Z"),
      status: "PRESENT" as const,
    },
    {
      employeeId: nadia.id,
      checkIn: new Date("2026-08-26T07:58:00.000Z"),
      checkOut: new Date("2026-08-26T17:00:00.000Z"),
      status: "PRESENT" as const,
    },
  ];

  for (const attendance of attendanceSeeds) {
    const dayStart = new Date(attendance.checkIn);
    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date(attendance.checkIn);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const existingAttendance =
      await prisma.attendance.findFirst({
        where: {
          employeeId: attendance.employeeId,
          checkIn: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

    if (!existingAttendance) {
      await AttendanceService.create(attendance);
    }
  }

  console.log("Demo attendances seeded.");

  const demoLeaveStart =
    new Date("2026-08-28T00:00:00.000Z");

  const demoLeaveEnd =
    new Date("2026-08-29T00:00:00.000Z");

  let seededDemoLeave =
    await prisma.leave.findFirst({
      where: {
        employeeId: rizky.id,
        startDate: demoLeaveStart,
        endDate: demoLeaveEnd,
      },
    });

  if (!seededDemoLeave) {
    seededDemoLeave =
      await LeaveService.create({
        employeeId: rizky.id,
        startDate: demoLeaveStart,
        endDate: demoLeaveEnd,
        reason: "Family matter",
      });
  }

  if (seededDemoLeave.status === "PENDING") {
    await LeaveService.approve(
      seededDemoLeave.id,
      demoAdmin.id,
    );

    console.log(
      "Demo leave created/approved.",
    );
  } else if (
    seededDemoLeave.status === "APPROVED"
  ) {
    console.log(
      "Demo leave already approved.",
    );
  } else {
    throw new Error(
      `Unexpected demo leave status: ${seededDemoLeave.status}`,
    );
  }

  const reviewPeriod = "2026-Q3";

  const existingPerformanceReview =
    await prisma.performanceReview.findFirst({
      where: {
        employeeId: rizky.id,
        reviewPeriod,
      },
    });

  if (!existingPerformanceReview) {
    await PerformanceReviewService.create({
      employeeId: rizky.id,
      reviewerId: demoAdmin.id,
      reviewPeriod,
      score: 88,
      comments:
        "Consistently meets operational targets and demonstrates strong teamwork.",
    });

    console.log(
      "Demo performance review created.",
    );
  } else {
    console.log(
      "Demo performance review already exists.",
    );
  }

  const payrollSeeds = [
    {
      employeeId: rizky.id,
      month: 8,
      year: 2026,
      bonus: 500000,
      deduction: 150000,
    },
    {
      employeeId: nadia.id,
      month: 8,
      year: 2026,
      bonus: 750000,
      deduction: 100000,
    },
    {
      employeeId: farhan.id,
      month: 8,
      year: 2026,
      bonus: 400000,
      deduction: 0,
    },
  ];

  for (const payrollData of payrollSeeds) {
    const existingPayroll =
      await prisma.payroll.findUnique({
        where: {
          employeeId_month_year: {
            employeeId: payrollData.employeeId,
            month: payrollData.month,
            year: payrollData.year,
          },
        },
      });

    if (!existingPayroll) {
      await PayrollService.create(payrollData);
    }
  }

  console.log("Demo payrolls seeded.");

  console.log("Demo master data seeded.");

  console.log("Demo seed completed.");
}

seedDemo()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });