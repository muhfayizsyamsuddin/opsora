import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid(),
    name: z.string().min(2).max(150),
    sku: z.string().min(1).max(50),
    barcode: z.string().max(100).optional(),
    purchasePrice: z.coerce.number().min(0),
    sellingPrice: z.coerce.number().min(0),
    stock: z.coerce.number().min(0).default(0),
    minimumStock: z.coerce.number().min(0).default(0),
    unit: z.string().min(1).max(20),
    imageUrl: z.string().url().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const getProductsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    sort: z
      .enum(['name', 'sku', 'createdAt'])
      .default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const getProductByIdSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid().optional(),
    name: z.string().min(2).max(150).optional(),
    sku: z.string().min(1).max(50).optional(),
    barcode: z.string().max(100).optional(),
    purchasePrice: z.coerce.number().min(0).optional(),
    sellingPrice: z.coerce.number().min(0).optional(),
    minimumStock: z.coerce.number().min(0).optional(),
    unit: z.string().min(1).max(20).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const deleteProductSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});