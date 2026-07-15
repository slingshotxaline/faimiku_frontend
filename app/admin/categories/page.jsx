"use client";

import { useState } from "react";
import {
  useListAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../../features/categories/categoriesApi";

const toSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const emptyForm = { name: "", slug: "", description: "" };

export default function AdminCategoriesPage() {
  const { data, isLoading } = useListAllCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const categories = data?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createCategory(form).unwrap();
      setForm(emptyForm);
    } catch (err) {
      setError(err?.data?.message || "Could not create category.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <form
        onSubmit={handleSubmit}
        className="border border-gray-100 rounded-xl p-4 mb-8 grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <input
          placeholder="Category name"
          required
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
              slug: toSlug(e.target.value),
            })
          }
          className="border rounded px-3 py-2 text-sm col-span-2"
        />
        <input
          placeholder="Slug"
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={isCreating}
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {isCreating ? "Adding..." : "+ Add Category"}
        </button>
        <input
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded px-3 py-2 text-sm col-span-3"
        />
        {error && <p className="text-sm text-red-600 col-span-4">{error}</p>}
      </form>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-b border-gray-50">
                <td className="py-3 pr-4 font-medium">{c.name}</td>
                <td className="py-3 pr-4 text-gray-400 font-mono text-xs">
                  {c.slug}
                </td>
                <td className="py-3 pr-4">
                  <button
                    onClick={() =>
                      updateCategory({ id: c._id, isActive: !c.isActive })
                    }
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      c.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="py-3 pr-4">
                  <button
                    onClick={() => deleteCategory(c._id)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
