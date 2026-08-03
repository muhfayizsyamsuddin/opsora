import { AppError } from "../../errors/AppError.js";
import { Prisma } from "../../generated/prisma/client.js";
import { EmployeeRepository } from "../employees/employee.repository.js";
import { PayrollRepository } from "./payroll.repository.js";

export class PayrollService {
  static async create(data: {
    employeeId: string;
    month: number;
    year: number;
    bonus: number;
    deduction: number;
  }) {
    // Cek employee
    const employee = await EmployeeRepository.findById(data.employeeId);

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    // Cek payroll sudah ada atau belum
    const existingPayroll =
      await PayrollRepository.findByEmployeeAndPeriod(
        data.employeeId,
        data.month,
        data.year,
      );

    if (existingPayroll) {
      throw new AppError(
        "Payroll for this employee and period already exists",
        409,
      );
    }

    // Hitung total salary
    const baseSalary = employee.salary;
    const totalSalary =
      baseSalary + data.bonus - data.deduction;

    return PayrollRepository.create({
      employeeId: data.employeeId,
      month: data.month,
      year: data.year,
      baseSalary,
      bonus: data.bonus,
      deduction: data.deduction,
      totalSalary,
    });
  }

  static async getAll(query: {
    page: number;
    limit: number;
    employeeId?: string;
    month?: number;
    year?: number;
    search?: string;
    sort: keyof Prisma.PayrollOrderByWithRelationInput;
    order: Prisma.SortOrder;
  }) {
    return PayrollRepository.findMany(query);
  }

  static async getById(id: string) {
    const payroll = await PayrollRepository.findById(id);

    if (!payroll) {
      throw new AppError("Payroll not found", 404);
    }

    return payroll;
  }

  static async delete(id: string) {
    const payroll = await PayrollRepository.findById(id);

    if (!payroll) {
      throw new AppError("Payroll not found", 404);
    }

    await PayrollRepository.delete(id);
  }
}