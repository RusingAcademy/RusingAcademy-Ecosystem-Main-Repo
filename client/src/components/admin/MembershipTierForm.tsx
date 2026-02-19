/**
 * MembershipTierForm — PR 7.1
 *
 * Create/edit form for membership tiers.
 * Handles both create and update via tRPC mutations.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface Tier {
  id: number;
  name: string;
  nameFr: string | null;
  slug: string;
  description: string | null;
  descriptionFr?: string | null;
  priceMonthly: string | null;
  priceYearly: string | null;
  currency: string | null;
  features: string[] | null;
  featuresFr?: string[] | null;
  isActive: boolean;
  sortOrder: number | null;
  maxCourses?: number | null;
  maxDMs?: number | null;
  canAccessPremiumContent?: boolean;
  canCreateEvents?: boolean;
  canAccessAnalytics?: boolean;
  badgeLabel: string | null;
  badgeColor: string | null;
}

interface Props {
  tier: Tier | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function MembershipTierForm({ tier, onSaved, onCancel }: Props) {
  const isEdit = !!tier;

  const [form, setForm] = useState({
    name: tier?.name || "",
    nameFr: tier?.nameFr || "",
    description: tier?.description || "",
    descriptionFr: tier?.descriptionFr || "",
    priceMonthly: tier?.priceMonthly || "0.00",
    priceYearly: tier?.priceYearly || "0.00",
    currency: tier?.currency || "CAD",
    features: (tier?.features || []).join("\n"),
    featuresFr: (tier?.featuresFr || []).join("\n"),
    maxCourses: tier?.maxCourses ?? -1,
    maxDMs: tier?.maxDMs ?? 5,
    canAccessPremiumContent: tier?.canAccessPremiumContent ?? false,
    canCreateEvents: tier?.canCreateEvents ?? false,
    canAccessAnalytics: tier?.canAccessAnalytics ?? false,
    badgeLabel: tier?.badgeLabel || "",
    badgeColor: tier?.badgeColor || "#7c3aed",
    isActive: tier?.isActive ?? true,
    sortOrder: tier?.sortOrder ?? 0,
  });

  const [error, setError] = useState<string | null>(null);

  const createMutation = trpc.membershipAdmin.create.useMutation({
    onSuccess: onSaved,
    onError: (err) => setError(err.message),
  });

  const updateMutation = trpc.membershipAdmin.update.useMutation({
    onSuccess: onSaved,
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      name: form.name,
      nameFr: form.nameFr || null,
      description: form.description || null,
      descriptionFr: form.descriptionFr || null,
      priceMonthly: form.priceMonthly,
      priceYearly: form.priceYearly,
      currency: form.currency,
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      featuresFr: form.featuresFr ? form.featuresFr.split("\n").map((f) => f.trim()).filter(Boolean) : null,
      maxCourses: form.maxCourses,
      maxDMs: form.maxDMs,
      canAccessPremiumContent: form.canAccessPremiumContent,
      canCreateEvents: form.canCreateEvents,
      canAccessAnalytics: form.canAccessAnalytics,
      badgeLabel: form.badgeLabel || null,
      badgeColor: form.badgeColor || null,
      isActive: form.isActive,
      sortOrder: form.sortOrder,
    };

    if (isEdit) {
      updateMutation.mutate({ id: tier.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? `Edit: ${tier.name}` : "New Membership Tier"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Basic Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name (EN) *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Professional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name (FR)
              </label>
              <input
                type="text"
                value={form.nameFr}
                onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Professionnel"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (EN)
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (FR)
              </label>
              <textarea
                value={form.descriptionFr}
                onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Pricing</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Price
              </label>
              <input
                type="text"
                value={form.priceMonthly}
                onChange={(e) => setForm({ ...form, priceMonthly: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
                placeholder="29.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Yearly Price
              </label>
              <input
                type="text"
                value={form.priceYearly}
                onChange={(e) => setForm({ ...form, priceYearly: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
                placeholder="299.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
              >
                <option value="CAD">CAD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Features (one per line)</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Features (EN)
              </label>
              <textarea
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white font-mono text-sm"
                placeholder="Access to all courses&#10;Priority support&#10;Monthly coaching call"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Features (FR)
              </label>
              <textarea
                value={form.featuresFr}
                onChange={(e) => setForm({ ...form, featuresFr: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white font-mono text-sm"
                placeholder="Accès à tous les cours&#10;Support prioritaire&#10;Appel coaching mensuel"
              />
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Permissions & Limits</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Courses (-1 = unlimited)
              </label>
              <input
                type="number"
                value={form.maxCourses}
                onChange={(e) => setForm({ ...form, maxCourses: parseInt(e.target.value) || -1 })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max DMs per day
              </label>
              <input
                type="number"
                value={form.maxDMs}
                onChange={(e) => setForm({ ...form, maxDMs: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.canAccessPremiumContent}
                onChange={(e) => setForm({ ...form, canAccessPremiumContent: e.target.checked })}
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Premium Content</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.canCreateEvents}
                onChange={(e) => setForm({ ...form, canCreateEvents: e.target.checked })}
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Create Events</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.canAccessAnalytics}
                onChange={(e) => setForm({ ...form, canAccessAnalytics: e.target.checked })}
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Analytics Access</span>
            </label>
          </div>
        </div>

        {/* Badge & Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Badge & Display</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={form.badgeLabel}
                onChange={(e) => setForm({ ...form, badgeLabel: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
                placeholder="PRO"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Badge Color
              </label>
              <input
                type="color"
                value={form.badgeColor}
                onChange={(e) => setForm({ ...form, badgeColor: e.target.value })}
                className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Active (visible to learners)</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 font-medium transition-colors"
          >
            {isPending ? "Saving..." : isEdit ? "Update Tier" : "Create Tier"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
