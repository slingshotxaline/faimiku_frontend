"use client";

import { useState } from "react";
import {
  useGetAllHomepageSectionsQuery,
  useCreateHomepageSectionMutation,
  useUpdateHomepageSectionMutation,
  useDeleteHomepageSectionMutation,
} from "../../../features/homepageSections/homepageSectionsApi";
import { useGetCategoriesQuery } from "../../../features/categories/categoriesApi";
import ProductPicker from "../../../components/admin/ProductPicker";
import { getProductImage } from "../../../utils/pricing";

const PROMO_OPTIONS = [
  { value: "isFeatured", label: "⭐ Featured" },
  { value: "isNewArrival", label: "✨ New Arrival" },
  { value: "isHotSale", label: "🔥 Hot Sale" },
  { value: "isFlashSale", label: "⚡ Flash Sale" },
];

const emptyForm = {
  title: "",
  subtitle: "",
  sourceType: "promo",
  category: "",
  promoFlag: "isFeatured",
  products: [],
  limit: 8,
  sortOrder: 0,
};

export default function AdminHomepageSectionsPage() {
  const { data, isLoading } = useGetAllHomepageSectionsQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const [createSection, { isLoading: isCreating }] =
    useCreateHomepageSectionMutation();
  const [updateSection] = useUpdateHomepageSectionMutation();
  const [deleteSection] = useDeleteHomepageSectionMutation();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const sections = data?.data || [];
  const categories = categoriesData?.data || [];

  const startEdit = (section) => {
    setEditingId(section._id);
    setForm({
      title: section.title,
      subtitle: section.subtitle || "",
      sourceType: section.sourceType,
      category: section.category?._id || "",
      promoFlag: section.promoFlag || "isFeatured",
      products: section.products || [],
      limit: section.limit,
      sortOrder: section.sortOrder,
    });
    setError("");
    setSuccess(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      sourceType: form.sourceType,
      limit: Number(form.limit),
      sortOrder: Number(form.sortOrder),
      ...(form.sourceType === "category" && { category: form.category }),
      ...(form.sourceType === "promo" && { promoFlag: form.promoFlag }),
      ...(form.sourceType === "custom" && {
        products: form.products.map((p) => p._id),
      }),
    };

    try {
      if (editingId) {
        await updateSection({ id: editingId, ...payload }).unwrap();
      } else {
        await createSection(payload).unwrap();
      }
      setSuccess(true);
      resetForm();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.data?.message || "Could not save this section.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Homepage Sections</h1>
      <p className="text-sm text-gray-500 mb-6">
        Build the storefront homepage's product rows — by category, by promo
        flag (Featured/New Arrival/Hot Sale/Flash Sale), or a hand-picked custom
        list. Order controls which appears first.
      </p>

      <form
        onSubmit={handleSubmit}
        className="border border-gray-100 rounded-xl p-4 mb-8 max-w-2xl space-y-4"
      >
        <h2 className="font-medium text-sm">
          {editingId ? "Edit Section" : "New Section"}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Section title (e.g. Men's Collection)"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Subtitle (optional)"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">
            Show products from
          </label>
          <div className="flex gap-2">
            {[
              { value: "category", label: "A Category" },
              { value: "promo", label: "A Promo Flag" },
              { value: "custom", label: "Custom Pick" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, sourceType: opt.value })}
                className={`px-3 py-2 rounded-lg text-sm border ${
                  form.sourceType === opt.value
                    ? "border-brand-500 text-brand-500 bg-brand-50"
                    : "border-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {form.sourceType === "category" && (
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm mt-1"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {form.sourceType === "promo" && (
          <div>
            <label className="text-sm font-medium">Promo Flag</label>
            <select
              value={form.promoFlag}
              onChange={(e) => setForm({ ...form, promoFlag: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm mt-1"
            >
              {PROMO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {form.sourceType === "custom" && (
          <div>
            <label className="text-sm font-medium block mb-2">Products</label>
            <ProductPicker
              selected={form.products}
              onChange={(products) => setForm({ ...form, products })}
            />
          </div>
        )}

        {form.sourceType !== "custom" && (
          <div>
            <label className="text-sm font-medium">Max products to show</label>
            <input
              type="number"
              min={1}
              max={24}
              value={form.limit}
              onChange={(e) => setForm({ ...form, limit: e.target.value })}
              className="w-24 border rounded px-3 py-2 text-sm mt-1"
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Position on page</label>
          <input
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            className="w-24 border rounded px-3 py-2 text-sm mt-1"
          />
          <p className="text-xs text-gray-400 mt-1">
            Lower numbers appear first.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">✓ Saved.</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isCreating}
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {isCreating
              ? "Saving..."
              : editingId
              ? "Save Changes"
              : "+ Add Section"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2.5 rounded-lg text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-2 max-w-2xl">
          {sections.map((section) => (
            <div
              key={section._id}
              className="flex items-center justify-between border border-gray-100 rounded-lg p-3"
            >
              <div>
                <p className="font-medium text-sm">{section.title}</p>
                <p className="text-xs text-gray-400">
                  {section.sourceType === "category" &&
                    `Category: ${section.category?.name || "—"}`}
                  {section.sourceType === "promo" &&
                    `Promo: ${
                      PROMO_OPTIONS.find((p) => p.value === section.promoFlag)
                        ?.label
                    }`}
                  {section.sourceType === "custom" &&
                    `${section.products?.length || 0} hand-picked product(s)`}
                  {" · Position "}
                  {section.sortOrder}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateSection({
                      id: section._id,
                      isActive: !section.isActive,
                    })
                  }
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    section.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {section.isActive ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => startEdit(section)}
                  className="text-brand-500 hover:underline text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSection(section._id)}
                  className="text-red-500 hover:underline text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {sections.length === 0 && (
            <p className="text-gray-400">No homepage sections yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
