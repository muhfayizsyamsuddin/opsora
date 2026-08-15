import { AppError } from "../../errors/AppError.js";
import { CustomerRepository } from "./customer.repository.js";

export class CustomerService {
  static async create(data: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  }) {
    const existingCustomer =
      await CustomerRepository.findByName(data.name);

    if (existingCustomer) {
      throw new AppError("Customer already exists", 409);
    }

    return CustomerRepository.create(data);
  }

  static async getAll(
    page = 1,
    limit = 10,
    search?: string,
    sort: "name" | "createdAt" = "createdAt",
    order: "asc" | "desc" = "desc",
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      CustomerRepository.findMany(
        skip,
        limit,
        search,
        sort,
        order,
      ),
      CustomerRepository.count(search),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const customer = await CustomerRepository.findById(id);

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    return customer;
  }

  static async update(
    id: string,
    data: {
      name?: string;
      phone?: string;
      email?: string;
      address?: string;
    },
  ) {
    const customer = await CustomerRepository.findById(id);

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    if (data.name) {
      const existingCustomer =
        await CustomerRepository.findByName(data.name);

      if (
        existingCustomer &&
        existingCustomer.id !== id
      ) {
        throw new AppError("Customer already exists", 409);
      }
    }

    return CustomerRepository.update(id, data);
  }

  static async delete(id: string) {
    const customer = await CustomerRepository.findById(id);

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    await CustomerRepository.softDelete(id);
  }
}