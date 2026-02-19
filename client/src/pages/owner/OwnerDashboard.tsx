/**
 * OwnerDashboard — Main Owner Portal dashboard page
 */
import OwnerLayout from "@/components/OwnerLayout";
import { OwnerStatsWidget } from "@/components/owner/OwnerStatsWidget";
import { OwnerQuickActions } from "@/components/owner/OwnerQuickActions";
import { OwnerAuditWidget } from "@/components/owner/OwnerAuditWidget";
import { OwnerHealthWidget } from "@/components/owner/OwnerHealthWidget";
import { Crown } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

export default function OwnerDashboard() {
  const { user } = useAuthContext();

  return (
    <OwnerLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#192524] dark:text-white">
              Welcome back, {user?.name?.split(" ")[0] || "Owner"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Owner Portal — Full ecosystem overview
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <OwnerStatsWidget />
      </div>

      {/* Health */}
      <div className="mb-6">
        <OwnerHealthWidget />
      </div>

      {/* Two-column: Quick Actions + Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OwnerQuickActions />
        <OwnerAuditWidget />
      </div>
    </OwnerLayout>
  );
}
