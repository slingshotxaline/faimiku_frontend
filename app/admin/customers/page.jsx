"use client";

import { useState } from "react";
import { useGetCustomersQuery } from "../../../features/customers/customersApi";
import { cleanParams } from "../../../lib/queryParams";
import ExportCsvButton from "../../../components/admin/ExportCsvButton";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useGetCustomersQuery(
    cleanParams({ search })
  );
  const customers = data?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <ExportCsvButton
          path="/users/customers/export.csv"
          label="Export Customers CSV"
        />
      </div>

      <input
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 text-sm w-72 mb-6"
      />

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : isError ? (
        <p className="text-red-600 text-sm">
          Could not load customers. You may not have permission, or there was a
          network error.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Joined</th>
              <th className="py-2 pr-4">Type</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-b border-gray-50">
                <td className="py-3 pr-4 font-medium">{c.name}</td>
                <td className="py-3 pr-4 text-gray-500">{c.email || "—"}</td>
                <td className="py-3 pr-4 text-gray-500">{c.phone || "—"}</td>
                <td className="py-3 pr-4 text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4">
                  {c.isGuest ? (
                    <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                      Guest
                    </span>
                  ) : (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                      Registered
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
