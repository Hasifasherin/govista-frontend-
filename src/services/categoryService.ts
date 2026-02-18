import api from "../utils/api";
import { Category } from "../types/category";

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get("/admin/categories");
  return res.data.categories;
};

export const createCategory = async (name: string): Promise<Category> => {
  const res = await api.post("/admin/categories", { name });
  return res.data.category;
};

export const updateCategory = async (
  id: string,
  data: Partial<Category>
): Promise<Category> => {
  const res = await api.patch(`/admin/categories/${id}`, data);
  return res.data.category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/admin/categories/${id}`);
};
