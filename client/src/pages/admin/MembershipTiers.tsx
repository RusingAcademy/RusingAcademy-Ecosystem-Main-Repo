/**
 * MembershipTiers Admin Page — PR 7.1
 *
 * Full CRUD for membership tiers with Stripe sync status.
 * Protected by MEMBERSHIPS_ADMIN_V2 feature flag.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useFeatureFlag, useFeatureFlags } from "@/hooks/useFeatureFlag";
import MembershipTierForm from "@/components/admin/MembershipTierForm";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Membership Tiers", description: "Manage and configure membership tiers" },
  fr: { title: "Membership Tiers", description: "Gérer et configurer membership tiers" },
};

interface Tier {
  id: number;
  name: string;
  nameFr: string | null;
  slug: string;
  description: string | null;
  priceMonthly: string | null;
  priceYearly: string | null;
  currency: string | null;
  features: string[] | null;
  isActive: boolean;
  sortOrder: number | null;
  stripeProductId: string | null;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  badgeLabel: string | null;
  badgeColor: string | null;
}

export default function MembershipTiers() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const { isLoading: flagLoading } = useFeatureFlags();
  const isEnabled = useFeatureFlag("MEMBERSHIPS_ADMIN_V2");
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: tiers, isLoading, refetch } = trpc.membershipAdmin.list.useQuery(undefined, {
    enabled: isEnabled,
  });

  const deleteMutation = trpc.membershipAdmin.delete.useMutation({
    onSuccess: () => refetch(),
  });

  if (flagLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-amber-800">Feature Not Enabled</h3>
        <p className="text-amber-600 mt-2">
          The Membership Admin feature is currently disabled. Enable the{" "}
          <code className="bg-amber-100 px-1 rounded">MEMBERSHIPS_ADMIN_V2</code> flag to access this page.
        </p>
      </div>
    );
  }

  if (showForm || editingTier) {
    return (
      <MembershipTierForm
        tier={editingTier}
        onSaved={() => {
          setEditingTier(null);
          setShowForm(false);
          refetch();
        }}
        onCancel={() => {
          setEditingTier(null);
          setShowForm(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Membership Tiers</h2>
          <p className="text-gray-500 mt-1">
            Manage subscription plans and Stripe pricing
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          + New Tier
        </button>
      </div>

      {/* Tiers Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        </div>
      ) : !tiers?.length ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-500">No membership tiers yet. Create your first one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stripe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(tiers as Tier[]).map((tier) => (
                <tr key={tier.id} className="hover:bg-gray-50:bg-gray-750">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {tier.badgeColor && (
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: tier.badgeColor }}
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{tier.name}</div>
                        {tier.nameFr && (
                          <div className="text-sm text-gray-500">{tier.nameFr}</div>
                        )}
                        <div className="text-xs text-gray-400">/{tier.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>${tier.priceMonthly}/mo</div>
                      <div className="text-gray-500">${tier.priceYearly}/yr</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {tier.stripeProductId ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Product synced
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          No product
                        </span>
                      )}
                      {tier.stripePriceIdMonthly && (
                        <span className="text-xs text-gray-400">Monthly price set</span>
                      )}
                      {tier.stripePriceIdYearly && (
                        <span className="text-xs text-gray-400">Yearly price set</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tier.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {tier.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingTier(tier)}
                      className="text-violet-600 hover:text-violet-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Deactivate "${tier.name}"? This will archive it in Stripe.`)) {
                          deleteMutation.mutate({ id: tier.id });
                        }
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
