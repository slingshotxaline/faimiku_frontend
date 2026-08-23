/**
 * Custom loader for next/image.
 *
 * Instead of routing every image through Next.js's built-in optimizer
 * (/_next/image, which downloads + re-encodes on the server and was
 * taking 3-13s per image in the network waterfall), this builds a URL
 * that asks the origin CDN to do the resizing itself:
 *  - Cloudinary: uses its own transformation URL params (f_auto, q_auto, w_*)
 *  - Unsplash: uses its ?w=&q=&auto=format params
 *  - anything else: returned as-is (no double-optimization, no breakage)
 */
export default function cloudinaryLoader({ src, width, quality }) {
    if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
      const params = `f_auto,q_${quality || "auto"},w_${width}`;
      return src.replace("/upload/", `/upload/${params}/`);
    }
  
    if (src.includes("images.unsplash.com")) {
      const separator = src.includes("?") ? "&" : "?";
      return `${src}${separator}w=${width}&q=${quality || 75}&auto=format`;
    }
  
    return src;
  }