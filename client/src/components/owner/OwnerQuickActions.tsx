/**
 * OwnerQuickActions — Quick action buttons for the Owner Dashboard
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Settings, Flag, Shield, Download, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

export function OwnerQuickActions() {
  const [, navigate] = useLocation();

  const actions = [
    { label: "Invite User", icon: UserPlus, onClick: () => navigate("/admin/invitations"), variant: "default" as const },
    { label: "Feature Flags", icon: Flag, onClick: () => navigate("/owner/flags"), variant: "outline" as const },
    { label: "View All Portals", icon: Shield, onClick: () => navigate("/dashboard"), variant: "outline" as const },
    { label: "Full Export", icon: Download, onClick: () => {}, variant: "outline" as const },
    { label: "Clear Cache", icon: RefreshCw, onClick: () => {}, variant: "outline" as const },
    { label: "System Settings", icon: Settings, onClick: () => navigate("/owner/settings"), variant: "outline" as const },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button key={action.label} variant={action.variant} className="justify-start gap-2 h-auto py-3" onClick={action.onClick}>
            <action.icon className="h-4 w-4" />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
