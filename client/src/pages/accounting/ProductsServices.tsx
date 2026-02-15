/*
 * QuickBooks Authentic — Products & Services page (live API data)
 */
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, MoreVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProductsServices() {
  const [, navigate] = useLocation();
  const [typeFilter, setTypeFilter] = useState("All");
  const { data: products, isLoading } = trpc.products.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const allProducts = (products || []) as any[];
  const filteredProducts = typeFilter === "All"
    ? allProducts
    : allProducts.filter((p: any) => p.type === typeFilter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products and services</h1>
        <div className="flex items-center gap-2">
          <button className="qb-btn-green flex items-center gap-1" onClick={() => navigate("/products-services/new")}>
            <Plus size={16} /> New
          </button>
          <button className="qb-btn-outline" onClick={() => toast("Feature coming soon")}>
            More actions
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full qb-table">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-8"><input type="checkbox" className="rounded" /></th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th className="text-right">Price</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod: any) => (
              <tr key={prod.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/products-services/${prod.id}`)}>
                <td onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded" /></td>
                <td className="text-[#0077C5] font-medium">{prod.name}</td>
                <td className="text-gray-600 text-xs max-w-[200px] truncate">{prod.description || "—"}</td>
                <td className="text-gray-600">{prod.category || "—"}</td>
                <td>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    prod.type === "Service" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {prod.type || "Service"}
                  </span>
                </td>
                <td className="text-right font-medium text-gray-800">
                  {prod.price ? `$${Number(prod.price).toFixed(2)}` : "—"}
                </td>
                <td>
                  <button className="p-1 hover:bg-gray-100 rounded" onClick={() => toast("Feature coming soon")}>
                    <MoreVertical size={14} className="text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
