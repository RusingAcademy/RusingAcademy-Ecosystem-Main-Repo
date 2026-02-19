/**
 * OwnerStatsWidget — Ecosystem stats cards for the Owner Dashboard
 */
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react";

export function OwnerStatsWidget() {
  const { data: stats, isLoading } = trpc.owner.getEcosystemStats.useQuery();

  const items = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, change: stats?.usersGrowth ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Courses", value: stats?.activeCourses ?? 0, change: stats?.coursesGrowth ?? 0, icon: BookOpen, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Monthly Revenue", value: `$${((stats?.monthlyRevenue ?? 0) / 100).toFixed(2)}`, change: stats?.revenueGrowth ?? 0, icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Active Sessions (24h)", value: stats?.activeSessions ?? 0, change: stats?.sessionsGrowth ?? 0, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></CardHeader>
            <CardContent><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
            <div className={`p-2 rounded-lg ${item.bg}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className={`text-xs mt-1 ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {item.change >= 0 ? "+" : ""}{item.change}% from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
