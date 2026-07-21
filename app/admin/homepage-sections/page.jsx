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
import ImageUploader from "../../../components/admin/ImageUploader";
import {
  LayoutGrid,
  GalleryHorizontal,
  LayoutPanelTop,
  Image as ImageIcon,
  Tag,
  FolderTree,
  Sparkles,
  X,
  Check,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Trash2,
  Loader2,
  Rows3,
} from "lucide-react";

const PROMO_OPTIONS = [
  { value: "isFeatured", label: "Featured", emoji: "⭐" },
  { value: "isNewArrival", label: "New Arrival", emoji: "✨" },
  { value: "isHotSale", label: "Hot Sale", emoji: "🔥" },
  { value: "isFlashSale", label: "Flash Sale", emoji: "⚡" },
];

const LAYOUT_OPTIONS = [
  {
    value: "grid",
    label: "Simple Grid",
    description: "A clean row of product cards.",
    icon: LayoutGrid,
  },
  {
    value: "featured",
    label: "Featured Collection",
    description: "A large lifestyle banner beside a product grid.",
    icon: GalleryHorizontal,
  },
  {
    value: "categories",
    label: "Category Showcase",
    description: '"Shop by category" tiles.',
    icon: LayoutPanelTop,
  },
];

const SOURCE_OPTIONS = [
  { value: "category", label: "A Category", icon: FolderTree },
  { value: "promo", label: "A Promo Flag", icon: Sparkles },
  { value: "custom", label: "Custom Pick", icon: Tag },
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
  layout: "grid",
  banner: { image: null, title: "", subtitle: "", linkUrl: "" },
  categories: [],
};

const inputClasses =
  "w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100";
const labelClasses = "text-sm font-medium text-gray-700";

function LayoutPreview({ value }) {
  if (value === "grid") {
    return (
      <div className="grid h-10 w-16 grid-cols-3 gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-sm bg-current opacity-20" />
        ))}
      </div>
    );
  }
  if (value === "featured") {
    return (
      <div className="flex h-10 w-16 gap-1">
        <div className="w-7 rounded-sm bg-current opacity-30" />
        <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-sm bg-current opacity-20" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-10 w-16 gap-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex-1 rounded-sm bg-current opacity-25" />
      ))}
    </div>
  );
}

function FormCard({ title, description, children }) {
  return (
    <div className="animate-[fadeIn_.3s_ease-out]">
      {title && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-800">{title}</p>
          {description && (
            <p className="mt-0.5 text-xs text-gray-400">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function SectionTypeIcon({ layout }) {
  const meta =
    LAYOUT_OPTIONS.find((l) => l.value === layout) || LAYOUT_OPTIONS[0];
  const Icon = meta.icon;
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
      <Icon className="h-5 w-5" />
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border border-gray-100 p-4"
        >
          <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
          <div className="ml-auto h-6 w-16 animate-pulse rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

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
      sourceType: section.sourceType || "promo",
      category: section.category?._id || "",
      promoFlag: section.promoFlag || "isFeatured",
      products: section.products || [],
      limit: section.limit,
      sortOrder: section.sortOrder,
      layout: section.layout || "grid",
      banner: section.banner || {
        image: null,
        title: "",
        subtitle: "",
        linkUrl: "",
      },
      categories: section.categories || [],
    });
    setError("");
    setSuccess(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const toggleCategory = (category) => {
    setForm((f) => {
      const exists = f.categories.some((c) => c._id === category._id);
      return {
        ...f,
        categories: exists
          ? f.categories.filter((c) => c._id !== category._id)
          : [...f.categories, category],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (form.layout === "featured" && !form.banner.image) {
      setError("Upload a banner image for a Featured Collection section.");
      return;
    }
    if (form.layout === "categories" && form.categories.length === 0) {
      setError("Select at least one category for a Category Showcase section.");
      return;
    }

    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      sortOrder: Number(form.sortOrder),
      layout: form.layout,
      ...(form.layout === "featured" && { banner: form.banner }),
      ...(form.layout === "categories"
        ? { categories: form.categories.map((c) => c._id) }
        : {
            sourceType: form.sourceType,
            limit: Number(form.limit),
            ...(form.sourceType === "category" && { category: form.category }),
            ...(form.sourceType === "promo" && { promoFlag: form.promoFlag }),
            ...(form.sourceType === "custom" && {
              products: form.products.map((p) => p._id),
            }),
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
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <h1 className="text-2xl font-bold text-gray-900">Homepage Sections</h1>
      <p className="mb-6 mt-1 max-w-2xl text-sm text-gray-500">
        Build the storefront homepage — product rows, a catalog-style featured
        banner, or a "shop by category" tile grid. Position controls which
        appears first.
      </p>

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-gray-900">
              {editingId ? "Edit Section" : "New Section"}
            </h2>
            {editingId && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                Editing
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Title</label>
              <input
                placeholder="e.g. Men's Collection"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`${inputClasses} mt-1.5`}
              />
            </div>
            <div>
              <label className={labelClasses}>Subtitle</label>
              <input
                placeholder="Optional"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className={`${inputClasses} mt-1.5`}
              />
            </div>
          </div>

          {/* Layout picker with mini previews */}
          <div>
            <label className={`${labelClasses} mb-2 block`}>Layout</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {LAYOUT_OPTIONS.map((opt) => {
                const active = form.layout === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, layout: opt.value })}
                    className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all ${
                      active
                        ? "border-brand-400 bg-brand-50/60 text-brand-600 ring-1 ring-brand-200"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <LayoutPreview value={opt.value} />
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          active ? "text-brand-600" : "text-gray-700"
                        }`}
                      >
                        {opt.label}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug text-gray-400">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {form.layout === "featured" && (
            <FormCard
              title="Featured Banner"
              description='A large lifestyle image beside a product grid. Uses up to 7 products from your source below, plus a "View More" tile as the 8th cell.'
            >
              <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Banner Image
                  </label>
                  {form.banner.image?.url ? (
                    <div className="relative w-40">
                      <img
                        src={form.banner.image.url}
                        alt=""
                        className="aspect-video w-40 rounded-lg border border-gray-200 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            banner: { ...form.banner, image: null },
                          })
                        }
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-500 shadow"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <ImageUploader
                      onUploaded={(img) =>
                        setForm({
                          ...form,
                          banner: { ...form.banner, image: img },
                        })
                      }
                      folder="homepage"
                    />
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    placeholder="Banner title (e.g. Designer Polo)"
                    value={form.banner.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        banner: { ...form.banner, title: e.target.value },
                      })
                    }
                    className={inputClasses}
                  />
                  <input
                    placeholder="Banner subtitle"
                    value={form.banner.subtitle}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        banner: { ...form.banner, subtitle: e.target.value },
                      })
                    }
                    className={inputClasses}
                  />
                </div>
                <input
                  placeholder="Link URL (optional — defaults to the category page)"
                  value={form.banner.linkUrl}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      banner: { ...form.banner, linkUrl: e.target.value },
                    })
                  }
                  className={inputClasses}
                />
              </div>
            </FormCard>
          )}

          {form.layout === "categories" ? (
            <FormCard title="Categories to Show">
              <p className="mb-2.5 text-xs text-gray-400">
                Add a banner image to each one under{" "}
                <a
                  href="/admin/categories"
                  target="_blank"
                  className="text-brand-500 hover:underline"
                >
                  Categories
                </a>{" "}
                for the best look — categories without one still show, just as a
                plain color tile.
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = form.categories.some(
                    (sel) => sel._id === c._id
                  );
                  return (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => toggleCategory(c)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? "border-brand-400 bg-brand-500 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {active && <Check className="h-3.5 w-3.5" />}
                      {c.name}
                    </button>
                  );
                })}
                {categories.length === 0 && (
                  <p className="text-sm text-gray-400">No categories yet.</p>
                )}
              </div>
            </FormCard>
          ) : (
            <FormCard title="Show products from">
              <div className="flex flex-wrap gap-2">
                {SOURCE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = form.sourceType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, sourceType: opt.value })
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "border-brand-400 bg-brand-50 text-brand-600"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {form.sourceType === "category" && (
                <div className="mt-3">
                  <label className={labelClasses}>Category</label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className={`${inputClasses} mt-1.5`}
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
                <div className="mt-3">
                  <label className={labelClasses}>Promo Flag</label>
                  <select
                    value={form.promoFlag}
                    onChange={(e) =>
                      setForm({ ...form, promoFlag: e.target.value })
                    }
                    className={`${inputClasses} mt-1.5`}
                  >
                    {PROMO_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.emoji} {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {form.sourceType === "custom" && (
                <div className="mt-3">
                  <label className={`${labelClasses} mb-2 block`}>
                    Products
                  </label>
                  <ProductPicker
                    selected={form.products}
                    onChange={(products) => setForm({ ...form, products })}
                  />
                </div>
              )}

              <div className="mt-3 max-w-[10rem]">
                <label className={labelClasses}>Max products</label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={form.limit}
                  onChange={(e) => setForm({ ...form, limit: e.target.value })}
                  className={`${inputClasses} mt-1.5`}
                />
                {form.layout === "featured" && (
                  <p className="mt-1 text-xs text-gray-400">
                    Only the first 7 are used; extras ignored.
                  </p>
                )}
              </div>
            </FormCard>
          )}

          <div className="max-w-[10rem]">
            <label className={labelClasses}>Position on page</label>
            <input
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              className={`${inputClasses} mt-1.5`}
            />
            <p className="mt-1 text-xs text-gray-400">
              Lower numbers appear first.
            </p>
          </div>

          {error && (
            <p className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
          {success && (
            <p className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Saved.
            </p>
          )}

          <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-md disabled:pointer-events-none disabled:opacity-50"
            >
              {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isCreating
                ? "Saving..."
                : editingId
                ? "Save Changes"
                : "Add Section"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* List */}
        <div className="xl:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <Rows3 className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-medium text-gray-700">
              Current Sections{" "}
              {!isLoading && (
                <span className="text-gray-400">({sections.length})</span>
              )}
            </h2>
          </div>

          {isLoading ? (
            <SkeletonList />
          ) : sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-12 text-center">
              <LayoutGrid className="h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-400">
                No homepage sections yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {sections.map((section, i) => (
                <div
                  key={section._id}
                  className="animate-[fadeIn_.4s_ease-out_backwards] rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <SectionTypeIcon layout={section.layout} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {section.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {section.layout === "categories" &&
                          `${section.categories?.length || 0} categor${
                            section.categories?.length === 1 ? "y" : "ies"
                          }`}
                        {section.layout !== "categories" &&
                          section.sourceType === "category" &&
                          `Category: ${section.category?.name || "—"}`}
                        {section.layout !== "categories" &&
                          section.sourceType === "promo" &&
                          `Promo: ${
                            PROMO_OPTIONS.find(
                              (p) => p.value === section.promoFlag
                            )?.label
                          }`}
                        {section.layout !== "categories" &&
                          section.sourceType === "custom" &&
                          `${
                            section.products?.length || 0
                          } hand-picked product(s)`}
                        {" · Position "}
                        {section.sortOrder}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSection({
                          id: section._id,
                          isActive: !section.isActive,
                        })
                      }
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        section.isActive
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {section.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                  <div className="mt-3 flex gap-4 border-t border-gray-50 pt-2.5 text-xs">
                    <button
                      onClick={() => startEdit(section)}
                      className="inline-flex items-center gap-1 font-medium text-brand-500 hover:underline"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSection(section._id)}
                      className="inline-flex items-center gap-1 font-medium text-red-500 hover:underline"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
