import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Check, X, Loader2 } from "lucide-react";

interface CouponInputProps {
  language?: "en" | "fr";
  onCouponApplied?: (coupon: {
    couponId: number;
    code: string;
    discountPercent: number;
    discountAmount: number;
    type: string;
  }) => void;
  onCouponRemoved?: () => void;
  className?: string;
}

export default function CouponInput({ language = "en", onCouponApplied, onCouponRemoved, className = "" }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    couponId: number;
    code: string;
    discountPercent: number;
    discountAmount: number;
    type: string;
  } | null>(null);
  const [error, setError] = useState("");

  const validateCoupon = trpc.stripe.validateCoupon.useMutation({
    onSuccess: (data) => {
      setAppliedCoupon(data);
      setError("");
      onCouponApplied?.(data);
    },
    onError: (err) => {
      setError(err.message || (language === "fr" ? "Code invalide" : "Invalid code"));
      setAppliedCoupon(null);
    },
  });

  const handleApply = () => {
    if (!code.trim()) return;
    setError("");
    validateCoupon.mutate({ code: code.trim().toUpperCase() });
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setCode("");
    setError("");
    onCouponRemoved?.();
  };

  const l = language === "fr" ? {
    placeholder: "Code promo",
    apply: "Appliquer",
    applied: "Appliqu\u00e9",
    remove: "Retirer",
    discount: "de r\u00e9duction",
  } : {
    placeholder: "Promo code",
    apply: "Apply",
    applied: "Applied",
    remove: "Remove",
    discount: "off",
  };

  if (appliedCoupon) {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 ${className}`}>
        <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200">
              {appliedCoupon.code}
            </Badge>
            <span className="text-sm text-emerald-700 dark:text-emerald-300">
              {appliedCoupon.discountPercent > 0
                ? `${appliedCoupon.discountPercent}% ${l.discount}`
                : `$${(appliedCoupon.discountAmount / 100).toFixed(2)} ${l.discount}`
              }
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRemove} className="h-8 text-muted-foreground hover:text-destructive">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={l.placeholder}
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="pl-9 uppercase"
            maxLength={20}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleApply}
          disabled={!code.trim() || validateCoupon.isPending}
          className="min-w-[80px]"
        >
          {validateCoupon.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            l.apply
          )}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive pl-1">{error}</p>
      )}
    </div>
  );
}
