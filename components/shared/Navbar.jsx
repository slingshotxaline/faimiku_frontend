"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import AccountMenu from "./AccountMenu";

export default function Navbar() {
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((n, i) => n + i.quantity, 0)
  );

  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center gap-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/assets/logo/logo.png"
            alt="Enterprise Store"
            width={180}
            height={50}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-md hidden md:block"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='search'
            className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-300"
          />
        </form>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700 ml-auto">
          <Link href="/products">Shop</Link>
          <Link href="/blog">Blog</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative text-sm font-medium text-gray-700"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
