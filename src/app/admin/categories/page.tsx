"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { Category } from "../../../types/category";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/categoryService";
import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";
import ConfirmationModal from "../../components/common/ConfirmationModal"; // ✅ IMPORT ADDED

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [categoryToDelete, setCategoryToDelete] =
    useState<Category | null>(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Save (create/update)
  const handleSaveCategory = async (name: string) => {
    try {
      if (editingCategory) {
        const updated = await updateCategory(
          editingCategory._id,
          { name }
        );

        setCategories(
          categories.map(cat =>
            cat._id === updated._id ? updated : cat
          )
        );
      } else {
        const newCat = await createCategory(name);
        setCategories([newCat, ...categories]);
      }

      setShowForm(false);
      setEditingCategory(null);
    } catch (err: any) {
      setError(err?.message || "Failed to save category");
    }
  };

  // ---------------- DELETE ----------------

  const handleDeleteClick = (category: Category) =>
    setCategoryToDelete(category);

  const cancelDelete = () =>
    setCategoryToDelete(null);

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete._id);

      setCategories(
        categories.filter(
          cat => cat._id !== categoryToDelete._id
        )
      );
    } catch (err: any) {
      setError(err?.message || "Failed to delete category");
    } finally {
      setCategoryToDelete(null);
    }
  };

  // Edit category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 relative">
        <h1 className="text-2xl font-bold">
          Categories
        </h1>

        {error && (
          <p className="text-red-500 bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <CategoryForm
            category={editingCategory}
            onSave={handleSaveCategory}
            onCancel={() => {
              setShowForm(false);
              setEditingCategory(null);
            }}
          />
        )}

        {/* Add Category Button */}
        {!showForm && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setShowForm(true)}
          >
            Add Category
          </button>
        )}

        {/* ✅ COMMON CONFIRMATION MODAL */}
        <ConfirmationModal
          title="Delete Category"
          description={
            categoryToDelete
              ? `Are you sure you want to delete "${categoryToDelete.name}"?`
              : ""
          }
          isOpen={!!categoryToDelete}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />

        {/* Categories Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <CategoryTable
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteClick}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
