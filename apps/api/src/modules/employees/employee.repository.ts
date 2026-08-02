import { prisma } from "../../lib/prisma.js";

export class EmployeeRepository {
    static async create(data: {
        name: string;
        email: string;
        position: string;
        salary: number;
        hireDate: Date;
        departmentId: string;
    }) {
        return prisma.employee.create({
            data,
            include: {
            department: true,
            },
        });
    }

    static async findByEmail(email: string) {
        return prisma.employee.findUnique({
            where: {
            email,
            },
        });
    }

    static async findById(id: string) {
        return prisma.employee.findUnique({
            where: {
            id,
            },
            include: {
            department: true,
            },
        });
    }

    static async findMany() {
        return prisma.employee.findMany({
            include: {
            department: true,
            },
            orderBy: {
            createdAt: "desc",
            },
        });
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
        return prisma.employee.update({
            where: {
            id,
            },
            data,
            include: {
            department: true,
            },
        });
    }

    static async delete(id: string) {
        return prisma.employee.delete({
            where: {
            id,
            },
        });
    }

    static async count() {
        return prisma.employee.count();
    }
}