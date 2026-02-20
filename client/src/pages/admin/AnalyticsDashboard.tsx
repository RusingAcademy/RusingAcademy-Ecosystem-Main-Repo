import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, DollarSign, BookOpen, Activity } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Analytics Dashboard", description: "Manage and configure analytics dashboard" },
  fr: { title: "Analytics Dashboard", description: "Gérer et configurer analytics dashboard" },
};

const ICON_MAP: Record<string, any> = {
  revenue: DollarSign,
  enrollments: BookOpen,
  sessions: Users,
  learner_progress: TrendingUp,
  course_completion: Activity,
  membership_churn: TrendingUp,
  email_engagement: BarChart3,
  automation_runs: Activity,
  group_sessions: Users,
};

const COLOR_MAP: Record<string, string> = {
  revenue: "text-green-400 bg-green-500/20",
  enrollments: "text-blue-400 bg-blue-500/20",
  sessions: "text-teal-400 bg-teal-500/20",
  learner_progress: "text-purple-400 bg-purple-500/20",
  course_completion: "text-orange-400 bg-orange-500/20",
  membership_churn: "text-red-400 bg-red-500/20",
  email_engagement: "text-yellow-400 bg-yellow-500/20",
  automation_runs: "text-indigo-400 bg-indigo-500/20",
  group_sessions: "text-cyan-400 bg-cyan-500/20",
};

const WIDTH_MAP: Record<string, string> = {
  quarter: "col-span-1",
  third: "col-span-1 md:col-span-1 lg:col-span-1",
  half: "col-span-1 md:col-span-2",
  full: "col-span-1 md:col-span-4",
};

export default function AnalyticsDashboard() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const { data: widgets, isLoading } = trpc.analyticsDashboard.getWidgets.useQuery({ dashboardId: "admin_main" });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-teal-400" /> Analytics Dashboard
        </h2>
        <p className="text-slate-400 mt-1">Platform metrics and business intelligence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {widgets?.map((widget: any) => {
          const Icon = ICON_MAP[widget.dataSource] || BarChart3;
          const colors = COLOR_MAP[widget.dataSource] || "text-slate-400 bg-slate-500/20";
          const widthClass = WIDTH_MAP[widget.width] || "col-span-1";

          if (widget.widgetType === "kpi_card") {
            return (
              <Card key={widget.id} className={`bg-slate-800/50 border-slate-700 ${widthClass}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{widget.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">--</p>
                      <p className="text-xs text-slate-500 mt-1">Enable flag to populate</p>
                    </div>
                    <div className={`p-3 rounded-lg ${colors.split(" ").slice(1).join(" ")}`}>
                      <Icon className={`h-6 w-6 ${colors.split(" ")[0]}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card key={widget.id} className={`bg-slate-800/50 border-slate-700 ${widthClass}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${colors.split(" ")[0]}`} />
                  {widget.title}
                  <Badge className="text-xs bg-slate-700 text-slate-300 ml-auto">{widget.widgetType.replace("_", " ")}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center border border-dashed border-slate-700 rounded-lg">
                  <p className="text-sm text-slate-500">Chart placeholder — enable flag to populate</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {(!widgets || widgets.length === 0) && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center text-slate-400">
            Analytics dashboard is disabled. Enable the ANALYTICS_DASHBOARDS_ENABLED feature flag to activate.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
