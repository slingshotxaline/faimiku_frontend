import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base RTK Query slice — feature slices (products, orders, etc.) inject
// their own endpoints via apiSlice.injectEndpoints() to keep this file thin.
const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: rawBaseQuery,
  tagTypes: ["Product", "Category", "Brand", "Order", "Cart", "User", "Review", "Wishlist", "Coupon", "Notification", "Return", "Blog", "Page", "Banner", "Inventory", "ShippingZone","HomepageSection"],
  endpoints: () => ({}),
});