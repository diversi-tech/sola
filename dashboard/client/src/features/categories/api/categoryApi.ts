import { getAuthHeaders } from '../../../lib/authHeaders';

export interface Category {
  id: number;
  name: string;
}

const BASE_URL = `${import.meta.env.VITE_REPORT_SERVICE_URL}/api/categories`;

export const categoryApi = {
  fetchCategories: async (): Promise<Category[]> => {
    const response = await fetch(BASE_URL, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch categories');
    const result = await response.json();
    return result.data ?? result;
  },

  createCategory: async (name: string): Promise<Category> => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to create category');
    const result = await response.json();
    return result.data ?? result;
  },

  updateCategory: async (id: number, name: string): Promise<Category> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to update category');
    const result = await response.json();
    return result.data ?? result;
  },

  deleteCategory: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete category');
  },
};
