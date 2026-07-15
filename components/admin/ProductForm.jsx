"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import { useGetBrandsQuery } from "../../features/brands/brandsApi";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../features/products/productsApi";
import ImageUploader from "./ImageUploader";
import VariantEditor from "./VariantEditor";
import RichTextEditor from "./RichTextEditor";

const toSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ProductForm({ initialProduct }) {
  const router = useRouter();
  const isEditing = !!initialProduct;
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [form, setForm] = useState({
    title: initialProduct?.title || "",
    slug: initialProduct?.slug || "",
    category: initialProduct?.category?._id || "",
    brand: initialProduct?.brand?._id || "",

    // Pricing tiers — only basePrice is required. See Product.js
    // getEffectivePrice() for how these are resolved at checkout time:
    // specialPrice > offerPrice > basePrice.
    oldPrice: initialProduct?.oldPrice || "",
    basePrice: initialProduct?.basePrice || "",
    offerPrice: initialProduct?.offerPrice || "",
    specialPrice: initialProduct?.specialPrice || "",

    stock: initialProduct?.stock || 0,
    shortDescription: initialProduct?.shortDescription || "",
    description: initialProduct?.description || "",
    baseImage: initialProduct?.baseImage || null,
    images: initialProduct?.images || [],
    hasVariants: initialProduct?.hasVariants || false,
    variants: initialProduct?.variants || [],

    isHotSale: initialProduct?.isHotSale || false,
    isNewArrival: initialProduct?.isNewArrival || false,
    isFlashSale: initialProduct?.isFlashSale || false,
    isFeatured: initialProduct?.isFeatured || false,
  });
  const [error, setError] = useState("");

  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];
  const isSaving = isCreating || isUpdating;

  const handleTitleChange = (title) => {
    setForm((f) => ({ ...f, title, slug: isEditing ? f.slug : toSlug(title) }));
  };

  const addGalleryImage = (image) => {
    setForm((f) => ({ ...f, images: [...f.images, image] }));
  };

  const removeGalleryImage = (index) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.baseImage) return setError("Upload a base image before saving.");
    if (form.hasVariants && form.variants.length === 0) {
      return setError('Add at least one variant, or turn off "Has variants".');
    }

    try {
      const payload = {
        ...form,
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        basePrice: Number(form.basePrice),
        offerPrice: form.offerPrice ? Number(form.offerPrice) : undefined,
        specialPrice: form.specialPrice ? Number(form.specialPrice) : undefined,
        stock: Number(form.stock),
        variants: form.variants.map((v) => ({
          ...v,
          price: Number(v.price),
          stock: Number(v.stock),
        })),
      };
      if (isEditing) {
        await updateProduct({ id: initialProduct._id, ...payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err?.data?.message || "Could not save product.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Slug</label>
        <input
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
          <p className="text-xs text-gray-400 mt-1">
            Don't see it? Add one under{" "}
            <a
              href="/admin/categories"
              target="_blank"
              className="text-brand-500 hover:underline"
            >
              Categories
            </a>
            .
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">Brand</label>
          <select
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm mt-1"
          >
            <option value="">No brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Don't see it? Add one under{" "}
            <a
              href="/admin/brands"
              target="_blank"
              className="text-brand-500 hover:underline"
            >
              Brands
            </a>
            .
          </p>
        </div>
      </div>

      {/* Pricing tiers */}
      <div>
        <label className="text-sm font-medium block mb-2">Pricing</label>
        <div className="grid grid-cols-2 gap-4 border border-gray-100 rounded-lg p-4">
          <div>
            <label className="text-xs text-gray-500">Old Price (৳)</label>
            <input
              type="number"
              min={0}
              placeholder="e.g. original / MRP"
              value={form.oldPrice}
              onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm mt-1"
            />
            <p className="text-xs text-gray-400 mt-1">
              Shown struck through, optional.
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500">Base Price (৳) *</label>
            <input
              type="number"
              required
              min={0}
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm mt-1"
            />
            <p className="text-xs text-gray-400 mt-1">
              The regular selling price.
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500">Offer Price (৳)</label>
            <input
              type="number"
              min={0}
              placeholder="Standing discount"
              value={form.offerPrice}
              onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm mt-1"
            />
            <p className="text-xs text-gray-400 mt-1">
              Overrides Base Price if set.
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500">Special Price (৳)</label>
            <input
              type="number"
              min={0}
              placeholder="Optional — e.g. flash sale"
              value={form.specialPrice}
              onChange={(e) =>
                setForm({ ...form, specialPrice: e.target.value })
              }
              className="w-full border rounded px-3 py-2 text-sm mt-1"
            />
            <p className="text-xs text-gray-400 mt-1">
              Overrides everything else if set.
            </p>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={form.hasVariants}
          onChange={(e) => setForm({ ...form, hasVariants: e.target.checked })}
        />
        This product has variants (size, color, etc.)
      </label>

      {form.hasVariants ? (
        <VariantEditor
          variants={form.variants}
          onChange={(variants) => setForm({ ...form, variants })}
        />
      ) : (
        <div>
          <label className="text-sm font-medium">Stock</label>
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm mt-1"
          />
        </div>
      )}

      {/* Promotional placement flags */}
      <div>
        <label className="text-sm font-medium block mb-2">Promotions</label>
        <div className="flex flex-wrap gap-4 border border-gray-100 rounded-lg p-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isHotSale}
              onChange={(e) =>
                setForm({ ...form, isHotSale: e.target.checked })
              }
            />
            🔥 Hot Sale
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isNewArrival}
              onChange={(e) =>
                setForm({ ...form, isNewArrival: e.target.checked })
              }
            />
            ✨ New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isFlashSale}
              onChange={(e) =>
                setForm({ ...form, isFlashSale: e.target.checked })
              }
            />
            ⚡ Flash Sale
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) =>
                setForm({ ...form, isFeatured: e.target.checked })
              }
            />
            ⭐ Featured
          </label>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Short Description</label>
        <input
          value={form.shortDescription}
          onChange={(e) =>
            setForm({ ...form, shortDescription: e.target.value })
          }
          className="w-full border rounded px-3 py-2 text-sm mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Description *</label>
        <RichTextEditor
          value={form.description}
          onChange={(description) => setForm({ ...form, description })}
        />
      </div>

      {/* Base image */}
      <div>
        <label className="text-sm font-medium block mb-2">Base Image *</label>
        <p className="text-xs text-gray-400 mb-2">
          The main product photo — used in listings and cards.
        </p>
        {form.baseImage?.url ? (
          <div className="relative w-32 h-32">
            <img
              src={form.baseImage.url}
              alt=""
              className="w-32 h-32 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, baseImage: null })}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white border rounded-full text-red-500 text-xs shadow"
            >
              ✕
            </button>
          </div>
        ) : (
          <ImageUploader
            onUploaded={(img) => setForm({ ...form, baseImage: img })}
            folder="products"
          />
        )}
      </div>

      {/* Additional gallery images */}
      <div>
        <label className="text-sm font-medium block mb-2">
          Additional Images
        </label>
        <div className="flex gap-3 flex-wrap">
          {form.images.map((img, i) => (
            <div key={i} className="relative w-32 h-32">
              <img
                src={img.url}
                alt=""
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeGalleryImage(i)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white border rounded-full text-red-500 text-xs shadow"
              >
                ✕
              </button>
            </div>
          ))}
          <ImageUploader onUploaded={addGalleryImage} folder="products" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSaving}
        className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}
