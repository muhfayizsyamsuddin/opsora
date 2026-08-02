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

    static async findMany(
        skip: number,
        take: number,
        search?: string,
        departmentId?: string,
        sort: "name" | "salary" | "hireDate" | "createdAt" = "createdAt",
        order: "asc" | "desc" = "desc",
    ) {
        return prisma.employee.findMany({
            skip,
            take,
            where: {
            ...(search && {
                OR: [
                {
                    name: {
                    contains: search,
                    mode: "insensitive",
                    },
                },
                {
                    email: {
                    contains: search,
                    mode: "insensitive",
                    },
                },
                {
                    position: {
                    contains: search,
                    mode: "insensitive",
                    },
                },
                ],
            }),
            ...(departmentId && {
                departmentId,
            }),
            },
            include: {
            department: true,
            },
            orderBy: {
            [sort]: order,
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

    static async count(
        search?: string,
        departmentId?: string,
    ) {
        return prisma.employee.count({
            where: {
            ...(search && {
                OR: [
                {
                    name: {
                    contains: search,
                    mode: "insensitive",
                    },
                },
                {
                    email: {
                    contains: search,
                    mode: "insensitive",
                    },
                },
                {
                    position: {
                    contains: search,
                    mode: "insensitive",
                    },
                },
                ],
            }),
            ...(departmentId && {
                departmentId,
            }),
            },
        });
    }
}