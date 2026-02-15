/**
 * ContentQualityBadge — Visual quality score indicator for course cards
 * 
 * Displays a letter grade (A-F) with color coding and tooltip showing
 * detailed quality check results. Used in admin course listings.
 */
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QualityCheck {
  hasThumbnail: boolean;
  hasDescription: boolean;
  hasShortDescription: boolean;
  hasFrenchTitle: boolean;
  hasFrenchDescription: boolean;
  hasMetaTitle: boolean;
  hasMetaDescription: boolean;
  hasPreviewVideo: boolean;
  hasModules: boolean;
  hasLessons: boolean;
  allModulesHaveTitles: boolean;
  allModulesHaveFrenchTitles: boolean;
  allLessonsHaveTitles: boolean;
  allLessonsHaveFrenchTitles: boolean;
  allLessonsHaveContent: boolean;
  hasPrice: boolean;
}

interface ContentQualityBadgeProps {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  checks?: QualityCheck;
  passedChecks?: number;
  totalChecks?: number;
  compact?: boolean;
}

const gradeColors: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300",
  B: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300",
  C: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300",
  D: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300",
  F: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300",
};

const checkLabels: Record<keyof QualityCheck, { en: string; category: string }> = {
  hasThumbnail: { en: "Thumbnail image", category: "Media" },
  hasDescription: { en: "Description (50+ chars)", category: "Content" },
  hasShortDescription: { en: "Short description", category: "Content" },
  hasFrenchTitle: { en: "French title", category: "Bilingual" },
  hasFrenchDescription: { en: "French description", category: "Bilingual" },
  hasMetaTitle: { en: "SEO meta title", category: "SEO" },
  hasMetaDescription: { en: "SEO meta description", category: "SEO" },
  hasPreviewVideo: { en: "Preview video", category: "Media" },
  hasModules: { en: "Has modules", category: "Structure" },
  hasLessons: { en: "Has lessons", category: "Structure" },
  allModulesHaveTitles: { en: "All modules titled", category: "Structure" },
  allModulesHaveFrenchTitles: { en: "All modules titled (FR)", category: "Bilingual" },
  allLessonsHaveTitles: { en: "All lessons titled", category: "Structure" },
  allLessonsHaveFrenchTitles: { en: "All lessons titled (FR)", category: "Bilingual" },
  allLessonsHaveContent: { en: "All lessons have content", category: "Content" },
  hasPrice: { en: "Pricing configured", category: "Commerce" },
};

export default function ContentQualityBadge({
  score,
  grade,
  checks,
  passedChecks,
  totalChecks,
  compact = false,
}: ContentQualityBadgeProps) {
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className={cn("font-bold text-xs cursor-help", gradeColors[grade])}
            >
              {grade}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="font-semibold">Quality Score: {score}%</p>
            {passedChecks !== undefined && totalChecks !== undefined && (
              <p className="text-xs text-muted-foreground">
                {passedChecks}/{totalChecks} checks passed
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-help",
            gradeColors[grade]
          )}>
            <span className="text-lg font-bold">{grade}</span>
            <span className="text-sm font-medium">{score}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="start" className="max-w-sm p-4">
          <div className="space-y-2">
            <p className="font-semibold text-sm">Content Quality Checklist</p>
            {checks && (
              <div className="space-y-1">
                {(Object.entries(checks) as [keyof QualityCheck, boolean][]).map(([key, passed]) => (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    {passed ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-400 shrink-0" />
                    )}
                    <span className={passed ? "text-muted-foreground" : "font-medium"}>
                      {checkLabels[key]?.en || key}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {passedChecks !== undefined && totalChecks !== undefined && (
              <div className="pt-1 border-t text-xs text-muted-foreground">
                {passedChecks}/{totalChecks} checks passed
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
