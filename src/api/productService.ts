import { apiClient } from './client';
import { ProductsResponse, Product, CategoryItem } from '../types/product';

export const productService = {
  getProducts: async (
    limit: number = 10,
    skip: number = 0,
    sortBy?: string,
    order?: 'asc' | 'desc',
  ): Promise<ProductsResponse> => {
    const params: Record<string, any> = { limit, skip };
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || 'asc';
    }
    const response = await apiClient.get<ProductsResponse>('/products', {
      params,
    });
    return response.data;
  },

  searchProducts: async (
    query: string,
    limit: number = 10,
    skip: number = 0,
  ): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>('/products/search', {
      params: { q: query, limit, skip },
    });
    return response.data;
  },

  getCategories: async (): Promise<CategoryItem[]> => {
    const response = await apiClient.get<CategoryItem[]>(
      '/products/categories',
    );
    return response.data;
  },

  getProductsByCategory: async (
    categorySlug: string,
    limit: number = 10,
    skip: number = 0,
  ): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(
      `/products/category/${categorySlug}`,
      {
        params: { limit, skip },
      },
    );
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },
};
