import { useCallback, useEffect, useState } from 'react';
import { categoryApi, Category } from '../api/categoryApi';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryApi.fetchCategories();
        if (active) setCategories(data);
      } catch (err) {
        if (active) setError('Error loading categories. Please try again.');
        console.error('Failed to load categories:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  const addCategory = useCallback(async (name: string) => {
    const created = await categoryApi.createCategory(name);
    setCategories((prev) => [...prev, created]);
    return created;
  }, []);

  const removeCategory = useCallback(async (id: number) => {
    await categoryApi.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { categories, loading, error, addCategory, removeCategory };
};
