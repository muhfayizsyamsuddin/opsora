import { AppError } from "../../errors/AppError.js";
import { DepartmentRepository } from "../departments/department.repository.js";
import { EmployeeRepository } from "./employee.repository.js";

export class EmployeeService {
    static async create(data: {
        name: string;
        email: string;
        position: string;
        salary: number;
        hireDate: Date;
        departmentId: string;
    }) {
        const existingEmployee = await EmployeeRepository.findByEmail(data.email);

        if (existingEmployee) {
            throw new AppError("Employee email already exists", 409);
        }

        const department = await DepartmentRepository.findById(data.departmentId);

        if (!department) {
            throw new AppError("Department not found", 404);
        }

        return EmployeeRepository.create(data);
    }

    static async getAll() {
        return EmployeeRepository.findMany();
    }

    static async getById(id: string) {
        const employee = await EmployeeRepository.findById(id);

        if (!employee) {
            throw new AppError("Employee not found", 404);
        }

        return employee;
    }

    static async update(
        id: string,
        data: {
            name?: string;
            email?: string;
            position?: string;
            salary?: number;
            hireDate?: Date;
            departmentId?: string;
        },
    ) {
        const employee = await EmployeeRepository.findById(id);

        if (!employee) {
            throw new AppError("Employee not found", 404);
        }

        if (data.email && data.email !== employee.email) {
            const existingEmployee = await EmployeeRepository.findByEmail(data.email);

            if (existingEmployee) {
            throw new AppError("Employee email already exists", 409);
            }
        }

        if (data.departmentId) {
            const department = await DepartmentRepository.findById(
            data.departmentId,
            );

            if (!department) {
            throw new AppError("Department not found", 404);
            }
        }

        return EmployeeRepository.update(id, data);
    }

    static async delete(id: string) {
        const employee = await EmployeeRepository.findById(id);

        if (!employee) {
            throw new AppError("Employee not found", 404);
        }

        await EmployeeRepository.delete(id);
    }
}