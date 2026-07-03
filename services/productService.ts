

import { productApi, getErrorMessage } from '@/services/authApi';
import type {
  Product,
  PaginatedResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/services/authApi';

export type { Product, PaginatedResponse, CreateProductRequest, UpdateProductRequest };

export interface ProductServiceError {
  message: string;
  code?: number;
}

function toServiceError(error: unknown): ProductServiceError {
  return {
    message: getErrorMessage(error),
    code: error instanceof Object && 'status' in error
      ? (error as { status: number }).status
      : undefined,
  };
}





function toNumericId(id: string): number {
  const numId = Number(id);
  if (!id || Number.isNaN(numId)) {
    throw { message: `Invalid product id: "${id}"`, code: 400 };
  }
  return numId;
}

class ProductService {
  private getAccessToken(): string {
    if (typeof window === 'undefined') throw { message: 'Not in browser', code: 0 };
    const token = localStorage.getItem('accessToken');
    if (!token) throw { message: 'Not authenticated. Please login first.', code: 401 };
    return token;
  }

  async getAllProducts(page = 1, pageSize = 12): Promise<PaginatedResponse<Product>> {
    try {
      const res = await productApi.getAll(page, pageSize);
      if (!res.success) throw new Error(res.message || 'Failed to fetch products');
      return res.data ?? { data: [], total: 0, page, pageSize, totalPages: 0 };
    } catch (e) { throw toServiceError(e); }
  }

    async getTrendingProducts(): Promise<Product[]> {
    try {
      const res = await productApi.getTrending();
      if (!res.success) throw new Error(res.message || 'Failed to fetch trending products');
      return res.data ?? [];
    } catch (e) { throw toServiceError(e); }
  }
  
  
  async getProductById(id: string): Promise<Product> {
    try {
      const numId = toNumericId(id);
      const res = await productApi.getById(numId);
      if (!res.success || !res.data) throw new Error(res.message || 'Product not found');
      return res.data;
    } catch (e) { throw toServiceError(e); }
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    try {
      const token = this.getAccessToken();
      const res = await productApi.create(data, token);
      if (!res.success || !res.data) throw new Error(res.message || 'Failed to create product');
      return res.data;
    } catch (e) { throw toServiceError(e); }
  }

  
  async updateProduct(id: string, data: UpdateProductRequest): Promise<Product> {
    try {
      const token = this.getAccessToken();
      const numId = toNumericId(id);
      const res = await productApi.update(numId, data, token);
      if (!res.success || !res.data) throw new Error(res.message || 'Failed to update product');
      return res.data;
    } catch (e) { throw toServiceError(e); }
  }

  
  async deleteProduct(id: string): Promise<void> {
    try {
      const token = this.getAccessToken();
      const numId = toNumericId(id);
      const res = await productApi.delete(numId, token);
      if (!res.success) throw new Error(res.message || 'Failed to delete product');
    } catch (e) { throw toServiceError(e); }
  }

  async searchProducts(query: string, page = 1, pageSize = 12): Promise<PaginatedResponse<Product>> {
    try {
      const res = await productApi.search(query, page, pageSize);
      if (!res.success) throw new Error(res.message || 'Search failed');
      return res.data ?? { data: [], total: 0, page, pageSize, totalPages: 0 };
    } catch (e) { throw toServiceError(e); }
  }

  async getProductsByCategory(category: string, page = 1, pageSize = 12): Promise<PaginatedResponse<Product>> {
    try {
      const res = await productApi.getByCategory(category, page, pageSize);
      if (!res.success) throw new Error(res.message || 'Failed to fetch by category');
      return res.data ?? { data: [], total: 0, page, pageSize, totalPages: 0 };
    } catch (e) { throw toServiceError(e); }
  }

  async getProductsByCollection(collection: string, page = 1, pageSize = 12): Promise<PaginatedResponse<Product>> {
    try {
      const res = await productApi.getByCollection(collection, page, pageSize);
      if (!res.success) throw new Error(res.message || 'Failed to fetch by collection');
      return res.data ?? { data: [], total: 0, page, pageSize, totalPages: 0 };
    } catch (e) { throw toServiceError(e); }
  }

  
  async getProductReviews(id: string): Promise<unknown[]> {
    try {
      const numId = toNumericId(id);
      const res = await productApi.getReviews(numId);
      if (!res.success) throw new Error(res.message || 'Failed to fetch reviews');
      return res.data ?? [];
    } catch (e) { throw toServiceError(e); }
  }


  async addProductReview(id: string, review: unknown): Promise<unknown> {
    try {
      const token = this.getAccessToken();
      const numId = toNumericId(id);
      const res = await productApi.addReview(numId, review, token);
      if (!res.success) throw new Error(res.message || 'Failed to add review');
      return res.data;
    } catch (e) { throw toServiceError(e); }
  }
}

export const productService = new ProductService();