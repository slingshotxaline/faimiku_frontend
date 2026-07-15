"use client";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNotifications from "../../components/admin/AdminNotifications";
import AdminGate from "../../components/admin/AdminGate";

export default function AdminLayout({ children }) {
  return (
    <AdminGate>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8 max-w-6xl">{children}</main>
        <AdminNotifications />
      </div>
    </AdminGate>
  );
}
