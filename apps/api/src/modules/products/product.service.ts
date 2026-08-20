import { AppError } from '../../errors/AppError.js';
import { ProductRepository } from './product.repository.js';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary.js';

export class ProductService {
  static async create(data: {
    categoryId: string;
    name: string;
    sku: string;
    barcode?: string;
    purchasePrice: number;
    sellingPrice: number;
    stock: number;
    minimumStock: number;
    unit: string;
    imageUrl?: string;
    status: 'ACTIVE' | 'INACTIVE';
  }) {
    if (data.sellingPrice < data.purchasePrice) {
      throw new AppError(
        'Selling price cannot be lower than purchase price',
        422,
      );
    }

    const existingSku = await ProductRepository.findBySku(data.sku);

    if (existingSku) {
      throw new AppError('Product SKU already exists', 409);
    }

    if (data.barcode) {
      const existingBarcode =
        await ProductRepository.findByBarcode(data.barcode);

      if (existingBarcode) {
        throw new AppError('Product barcode already exists', 409);
      }
    }

    return ProductRepository.create(data);
  }

  static async getAllProducts(
    page = 1,
    limit = 10,
    search?: string,
    categoryId?: string,
    status?: 'ACTIVE' | 'INACTIVE',
    sort: 'name' | 'sku' | 'createdAt' = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      ProductRepository.findMany(
        skip,
        limit,
        search,
        categoryId,
        status,
        sort,
        order,
      ),
      ProductRepository.count(
        search,
        categoryId,
        status,
      ),
    ]);

    return {
      data: products,
      meta: {
        page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  static async update(
    id: string,
    data: {
      categoryId?: string;
      name?: string;
      sku?: string;
      barcode?: string;
      purchasePrice?: number;
      sellingPrice?: number;
      minimumStock?: number;
      unit?: string;
      status?: 'ACTIVE' | 'INACTIVE';
      imageUrl?: string;
    },
  ) {
    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const purchasePrice =
      data.purchasePrice ?? Number(product.purchasePrice);

    const sellingPrice =
      data.sellingPrice ?? Number(product.sellingPrice);

    if (sellingPrice < purchasePrice) {
      throw new AppError(
        'Selling price cannot be lower than purchase price',
        422,
      );
    }

    if (data.sku && data.sku !== product.sku) {
      const existingSku =
        await ProductRepository.findBySku(data.sku);

      if (
        existingSku &&
        existingSku.id !== id
      ) {
        throw new AppError(
          'Product SKU already exists',
          409,
        );
      }
    }

    if (
      data.barcode &&
      data.barcode !== product.barcode
    ) {
      const existingBarcode =
        await ProductRepository.findByBarcode(data.barcode);

      if (
        existingBarcode &&
        existingBarcode.id !== id
      ) {
        throw new AppError(
          'Product barcode already exists',
          409,
        );
      }
    }

    return ProductRepository.update(id, data);
  }

  static async delete(id: string) {
    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await ProductRepository.softDelete(id);
  }

  static async uploadImage(
    id: string,
    file: Express.Multer.File,
  ) {
    const product = await ProductRepository.findById(id);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    const result = await uploadToCloudinary(
        file.buffer,
        'opsora/products',
    );

    return ProductRepository.update(id, {
        imageUrl: result.secure_url,
    });
  }
}