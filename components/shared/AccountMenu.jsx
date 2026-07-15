"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../features/auth/authApi";
import { clearCredentials } from "../../features/auth/authSlice";
import { setAccessToken } from "../../services/apiClient";
import { STAFF_ROLES } from "../../features/auth/roles";

export default function AccountMenu() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3 text-sm font-medium">
        <Link href="/login" className="text-gray-700 hover:text-brand-500">
          Log In
        </Link>
        <Link
          href="/register"
          className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-lg"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // even if the API call fails, clear local state so the UI reflects logged-out
    }
    dispatch(clearCredentials());
    setAccessToken(null);
    setOpen(false);
    router.push("/");
  };

  const isStaff = STAFF_ROLES.includes(user?.role);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700"
      >
        <span className="w-7 h-7 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center text-xs font-bold">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </span>
        {user?.name}
        {user?.isGuest && (
          <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
            Guest
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-lg py-1 text-sm">
          {user?.isGuest && (
            <Link
              href="/set-password"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 hover:bg-gray-50 text-brand-500 font-medium"
            >
              Secure your account →
            </Link>
          )}
          <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-gray-50"
          >
            My Orders
          </Link>
          <Link
            href="/wishlist"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-gray-50"
          >
            Wishlist
          </Link>
          {isStaff && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 hover:bg-gray-50 text-brand-500"
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-500"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
