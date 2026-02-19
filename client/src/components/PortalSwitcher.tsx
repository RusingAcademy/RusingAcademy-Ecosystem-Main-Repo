/**
 * PortalSwitcher — Enhanced cross-portal navigation component
 * Auth Phase 5: Provides unified portal switching across all dashboards
 * including the new Owner Portal from Phase 3.
 *
 * Supports: Owner, Admin, HR, Coach, Learner portals
 * Role-aware: Only shows portals the user has access to
 * Bilingual: FR/EN
 */
import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Crown, Shield, Building2, GraduationCap, User,
  ChevronDown, CheckCircle, ArrowRightLeft,
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface PortalOption {
  id: string;
  labelEn: string;
  labelFr: string;
  icon: React.ReactNode;
  href: string;
  roles: string[];
  color: string;
  badgeColor: string;
  description: { en: string; fr: string };
}

const portalOptions: PortalOption[] = [
  {
    id: "owner",
    labelEn: "Owner Portal",
    labelFr: "Portail propriétaire",
    icon: <Crown className="h-4 w-4" />,
    href: "/owner",
    roles: ["owner"],
    color: "bg-gradient-to-br from-amber-500 to-orange-600",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    description: {
      en: "Full ecosystem control & monitoring",
      fr: "Contrôle et surveillance de l'écosystème",
    },
  },
  {
    id: "admin",
    labelEn: "Admin Dashboard",
    labelFr: "Tableau de bord admin",
    icon: <Shield className="h-4 w-4" />,
    href: "/admin",
    roles: ["admin", "owner"],
    color: "bg-gradient-to-br from-indigo-500 to-purple-600",
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
    description: {
      en: "Manage users, content & settings",
      fr: "Gérer les utilisateurs, le contenu et les paramètres",
    },
  },
  {
    id: "hr",
    labelEn: "HR Dashboard",
    labelFr: "Tableau de bord RH",
    icon: <Building2 className="h-4 w-4" />,
    href: "/dashboard/hr",
    roles: ["hr_admin", "admin", "owner"],
    color: "bg-gradient-to-br from-teal-500 to-emerald-600",
    badgeColor: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
    description: {
      en: "Team management & reporting",
      fr: "Gestion d'équipe et rapports",
    },
  },
  {
    id: "coach",
    labelEn: "Coach Dashboard",
    labelFr: "Tableau de bord coach",
    icon: <User className="h-4 w-4" />,
    href: "/dashboard/coach",
    roles: ["coach", "admin", "owner"],
    color: "bg-gradient-to-br from-emerald-500 to-green-600",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    description: {
      en: "Sessions, learners & earnings",
      fr: "Sessions, apprenants et revenus",
    },
  },
  {
    id: "learner",
    labelEn: "Learner Dashboard",
    labelFr: "Tableau de bord apprenant",
    icon: <GraduationCap className="h-4 w-4" />,
    href: "/dashboard/learner",
    roles: ["learner", "coach", "hr_admin", "admin", "owner"],
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    description: {
      en: "Courses, progress & SLE prep",
      fr: "Cours, progrès et préparation ELS",
    },
  },
];

/**
 * PortalSwitcher — Full dropdown with descriptions
 */
export function PortalSwitcher() {
  const { user } = useAuthContext();
  const { language } = useLanguage();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const userRole = user?.role || "learner";
  const isOwner = user?.isOwner || userRole === "owner";

  // Filter portals based on user role
  const availablePortals = portalOptions.filter((option) => {
    if (option.id === "owner" && isOwner) return true;
    return option.roles.includes(userRole);
  });

  // Determine current portal
  const currentPortal = availablePortals.find((option) => {
    if (option.href === "/owner" && location.startsWith("/owner")) return true;
    if (option.href === "/admin" && location.startsWith("/admin")) return true;
    return location.startsWith(option.href);
  }) || availablePortals[availablePortals.length - 1]; // Default to last (learner)

  // Don't render if only one portal available
  if (availablePortals.length <= 1) return null;

  const labels = {
    en: { switchPortal: "Switch Portal", currentPortal: "Current Portal", availablePortals: "Available Portals" },
    fr: { switchPortal: "Changer de portail", currentPortal: "Portail actuel", availablePortals: "Portails disponibles" },
  };
  const l = labels[language] || labels.en;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 h-9 px-3 rounded-lg border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.08] backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-white/[0.12]"
        >
          <div className={`p-1 rounded-md ${currentPortal?.color || ""} text-white`}>
            {currentPortal?.icon}
          </div>
          <span className="hidden sm:inline text-sm font-medium">
            {language === "fr" ? currentPortal?.labelFr : currentPortal?.labelEn}
          </span>
          <ArrowRightLeft className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 p-2">
        <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
          {l.switchPortal}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availablePortals.map((option) => {
          const isActive =
            (option.href === "/owner" && location.startsWith("/owner")) ||
            (option.href === "/admin" && location.startsWith("/admin")) ||
            location.startsWith(option.href);
          return (
            <DropdownMenuItem
              key={option.id}
              asChild
              className={`cursor-pointer rounded-lg px-2 py-2.5 ${
                isActive ? "bg-slate-100 dark:bg-white/[0.06]" : ""
              }`}
            >
              <Link href={option.href} onClick={() => setOpen(false)}>
                <div className="flex items-start gap-3 w-full">
                  <div className={`p-1.5 rounded-lg ${option.color} text-white shrink-0 mt-0.5`}>
                    {option.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {language === "fr" ? option.labelFr : option.labelEn}
                      </span>
                      {isActive && <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {language === "fr" ? option.description.fr : option.description.en}
                    </p>
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * PortalSwitcherCompact — Pill-style switcher for dashboard headers
 */
export function PortalSwitcherCompact() {
  const { user } = useAuthContext();
  const { language } = useLanguage();
  const [location] = useLocation();

  const userRole = user?.role || "learner";
  const isOwner = user?.isOwner || userRole === "owner";

  const availablePortals = portalOptions.filter((option) => {
    if (option.id === "owner" && isOwner) return true;
    return option.roles.includes(userRole);
  });

  if (availablePortals.length <= 1) return null;

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
      {availablePortals.map((option) => {
        const isActive =
          (option.href === "/owner" && location.startsWith("/owner")) ||
          (option.href === "/admin" && location.startsWith("/admin")) ||
          location.startsWith(option.href);
        return (
          <Link key={option.id} href={option.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={`gap-1.5 h-8 px-3 rounded-md ${
                isActive ? "" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.icon}
              <span className="hidden sm:inline text-xs font-medium">
                {(language === "fr" ? option.labelFr : option.labelEn)
                  .replace(" Dashboard", "")
                  .replace(" Tableau de bord", "")
                  .replace(" Portal", "")
                  .replace(" Portail", "")}
              </span>
            </Button>
          </Link>
        );
      })}
    </div>
  );
}

export default PortalSwitcher;
