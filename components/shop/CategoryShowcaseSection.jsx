// "use client";

// import Link from "next/link";

// // "Shop by Category" tile grid — fundamentally different from the other two
// // templates in that it shows categories, not products. Each tile is a
// // Category's banner image (falls back to a plain color block with just the
// // name if no banner was set at /admin/categories) linking to that
// // category's filtered product listing.
// export default function CategoryShowcaseSection({ section }) {
//   const { title, subtitle, categories } = section;

//   return (
//     <section className="mb-14">
//       {(title || subtitle) && (
//         <div className="mb-4">
//           {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
//           {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
//         </div>
//       )}

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {categories.map((category) => (
//           <Link
//             key={category._id}
//             href={`/products?category=${category._id}`}
//             className="relative aspect-[4/3] rounded-xl overflow-hidden group block bg-gradient-to-br from-brand-50 to-gray-100"
//           >
//             {category.banner?.url && (
//               <img
//                 src={category.banner.url}
//                 alt={category.name}
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//               />
//             )}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
//             <div className="absolute inset-0 flex items-end p-4">
//               <h3 className="text-white font-semibold text-lg drop-shadow">{category.name}</h3>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";

export default function FeaturedCollectionSection() {
  return <div>Featured Section</div>;
}