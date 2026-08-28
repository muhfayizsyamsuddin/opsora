import { AppError } from '../../errors/AppError.js';
import { SupplierRepository } from './supplier.repository.js';

export class SupplierService {
  static async create(data: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  }) {
    const existingSupplier = await SupplierRepository.findByName(data.name);

    if (existingSupplier) {
      throw new AppError('Supplier already exists', 409);
    }

    return SupplierRepository.create(data);
  }

  static async getAllSuppliers(
    page = 1,
    limit = 10,
    search?: string,
    sort: 'name' | 'createdAt' = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    const skip = (page - 1) * limit;

    const [suppliers, total] = await Promise.all([
      SupplierRepository.findMany(
        skip,
        limit,
        search,
        sort,
        order,
      ),
      SupplierRepository.count(search),
    ]);

    return {
      data: suppliers,
      meta: {
        page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const supplier = await SupplierRepository.findById(id);

    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }

    return supplier;
  }

  static async update(
    id: string,
    data: {
      name?: string;
      phone?: string | null;
      email?: string | null;
      address?: string | null;
    },
  ) {
    const supplier = await SupplierRepository.findById(id);

    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }

    if (data.name) {
      const existingSupplier =
        await SupplierRepository.findByName(data.name);

      if (existingSupplier && existingSupplier.id !== id) {
        throw new AppError('Supplier already exists', 409);
      }
    }

    return SupplierRepository.update(id, data);
  }

  static async delete(id: string) {
    const supplier = await SupplierRepository.findById(id);

    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }

    await SupplierRepository.softDelete(id);
  }
}