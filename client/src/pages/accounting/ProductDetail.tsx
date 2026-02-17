/*
 * QuickBooks Authentic — Product/Service Detail Page
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Loader2, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const [, params] = useRoute("/products-services/:id");
  const [, navigate] = useLocation();
  const productId = params?.id ? Number(params.id) : 0;
  const isNew = params?.id === "new";

  const { data: product, isLoading, refetch } = trpc.products.getById.useQuery(
    { id: productId },
    { enabled: !isNew && productId > 0 }
  );

  const createMutation = trpc.products.create.useMutation({
    onSuccess: (data: any) => {
      toast.success("Product/Service created");
      navigate(`/products-services/${data.id}`);
    },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Product/Service updated");
      refetch();
      setIsEditing(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const [isEditing, setIsEditing] = useState(isNew);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Service" | "Inventory" | "Non-Inventory">("Service");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("0");
  const [cost, setCost] = useState("0");
  const [sku, setSku] = useState("");
  const [isTaxable, setIsTaxable] = useState(true);

  useMemo(() => {
    if (product && !isNew) {
      const p = product as any;
      setName(p.name || "");
      setDescription(p.description || "");
      setType(p.type || "Service");
      setCategory(p.category || "");
      setPrice(String(p.price || "0"));
      setCost(String(p.cost || "0"));
      setSku(p.sku || "");
      setIsTaxable(p.isTaxable !== false);
    }
  }, [product, isNew]);

  const handleSave = () => {
    if (!name) {
      toast.error("Name is required");
      return;
    }
    if (isNew) {
      createMutation.mutate({ name, description, type, category, price, cost, sku, isTaxable });
    } else {
      updateMutation.mutate({ id: productId, name, description, type, category, price, cost, sku, isTaxable });
    }
  };

  const p = product as any;

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[700px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/products-services")} className="p-2 hover:bg-gray-100 dark:bg-card rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? "New Product/Service" : (p?.name || "")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && !isEditing && (
            <button aria-label="Action" className="qb-btn-outline flex items-center gap-1" onClick={() => setIsEditing(true)}>
              <Edit size={14} /> Edit
            </button>
          )}
          {(isNew || isEditing) && (
            <>
              <button aria-label="Action" className="qb-btn-outline flex items-center gap-1" onClick={() => isNew ? navigate("/products-services") : setIsEditing(false)}>
                <X size={14} /> Cancel
              </button>
              <button aria-label="Action" className="qb-btn-green flex items-center gap-1" onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="animate-spin" size={14} /> : <><Save size={14} /> Save</>}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="qb-card">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name *</label>
            {isEditing ? (
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <p className="text-gray-800 dark:text-foreground font-medium">{p?.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
              {isEditing ? (
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={type} onChange={(e) => setType(e.target.value as any)}>
                  <option>Service</option>
                  <option>Inventory</option>
                  <option>Non-Inventory</option>
                </select>
              ) : (
                <p className="text-gray-800">{p?.type}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              {isEditing ? (
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={category} onChange={(e) => setCategory(e.target.value)} />
              ) : (
                <p className="text-gray-800">{p?.category || "—"}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
            {isEditing ? (
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            ) : (
              <p className="text-sm text-gray-600">{p?.description || "—"}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sales Price</label>
              {isEditing ? (
                <input type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={price} onChange={(e) => setPrice(e.target.value)} />
              ) : (
                <p className="text-gray-800 dark:text-foreground font-medium">${Number(p?.price || 0).toFixed(2)}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cost</label>
              {isEditing ? (
                <input type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={cost} onChange={(e) => setCost(e.target.value)} />
              ) : (
                <p className="text-gray-800">${Number(p?.cost || 0).toFixed(2)}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SKU</label>
              {isEditing ? (
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={sku} onChange={(e) => setSku(e.target.value)} />
              ) : (
                <p className="text-gray-800">{p?.sku || "—"}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={isTaxable} onChange={(e) => setIsTaxable(e.target.checked)} className="rounded border-gray-300" />
                Taxable
              </label>
            ) : (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p?.isTaxable ? "bg-green-100 text-green-700" : "bg-gray-100 dark:bg-card text-gray-600"}`}>
                {p?.isTaxable ? "Taxable" : "Non-taxable"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
