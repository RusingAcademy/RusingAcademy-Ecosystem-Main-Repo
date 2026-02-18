/**
 * ============================================
 * INTERNATIONALIZATION FORMATTING UTILITIES
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Language-specific formatting for Canadian EN/FR:
 * - Dates (YYYY-MM-DD Canadian standard)
 * - Numbers (EN: 1,234.56 / FR: 1 234,56)
 * - Currency (EN: $1,234.56 / FR: 1 234,56 $)
 * - Proper text directionality
 * - Font loading optimization for French diacritics
 */
import React, { createContext, useContext, useMemo, useCallback } from "react";
import type { Locale } from "@/i18n/LocaleContext";
import { useLocale } from "@/i18n/LocaleContext";

/* ── Types ── */
export interface FormatOptions {
  locale: Locale;
}

export interface DateFormatOptions {
  format?: "short" | "medium" | "long" | "iso";
  includeTime?: boolean;
}

export interface NumberFormatOptions {
  decimals?: number;
  style?: "decimal" | "percent";
}

export interface CurrencyFormatOptions {
  currency?: string;
  showSymbol?: boolean;
}

/* ── Formatting Functions ── */

/**
 * Format date according to Canadian standards
 * EN-CA: 2026-02-18 (ISO-like) or February 18, 2026
 * FR-CA: 2026-02-18 (ISO-like) or 18 février 2026
 */
export function formatDate(
  date: Date | string | number,
  locale: Locale,
  options: DateFormatOptions = {}
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const { format = "medium", includeTime = false } = options;
  const localeTag = locale === "fr" ? "fr-CA" : "en-CA";

  if (format === "iso") {
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  const dateOpts: Intl.DateTimeFormatOptions = {};
  switch (format) {
    case "short":
      dateOpts.year = "numeric";
      dateOpts.month = "2-digit";
      dateOpts.day = "2-digit";
      break;
    case "medium":
      dateOpts.year = "numeric";
      dateOpts.month = "long";
      dateOpts.day = "numeric";
      break;
    case "long":
      dateOpts.year = "numeric";
      dateOpts.month = "long";
      dateOpts.day = "numeric";
      dateOpts.weekday = "long";
      break;
  }

  if (includeTime) {
    dateOpts.hour = "2-digit";
    dateOpts.minute = "2-digit";
    dateOpts.hour12 = locale === "en";
  }

  return new Intl.DateTimeFormat(localeTag, dateOpts).format(d);
}

/**
 * Format number according to Canadian locale
 * EN: 1,234.56
 * FR: 1 234,56 (non-breaking space as thousands separator)
 */
export function formatNumber(
  value: number,
  locale: Locale,
  options: NumberFormatOptions = {}
): string {
  const { decimals, style = "decimal" } = options;
  const localeTag = locale === "fr" ? "fr-CA" : "en-CA";

  const opts: Intl.NumberFormatOptions = { style };
  if (decimals !== undefined) {
    opts.minimumFractionDigits = decimals;
    opts.maximumFractionDigits = decimals;
  }

  return new Intl.NumberFormat(localeTag, opts).format(value);
}

/**
 * Format currency according to Canadian locale
 * EN: $1,234.56
 * FR: 1 234,56 $
 */
export function formatCurrency(
  value: number,
  locale: Locale,
  options: CurrencyFormatOptions = {}
): string {
  const { currency = "CAD" } = options;
  const localeTag = locale === "fr" ? "fr-CA" : "en-CA";

  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(value);
}

/**
 * Format relative time (e.g., "2 hours ago" / "il y a 2 heures")
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: Locale
): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const localeTag = locale === "fr" ? "fr-CA" : "en-CA";
  const rtf = new Intl.RelativeTimeFormat(localeTag, { numeric: "auto" });

  if (diffDay > 0) return rtf.format(-diffDay, "day");
  if (diffHour > 0) return rtf.format(-diffHour, "hour");
  if (diffMin > 0) return rtf.format(-diffMin, "minute");
  return rtf.format(-diffSec, "second");
}

/* ── useFormatting Hook ── */
export function useFormatting() {
  const { locale } = useLocale();

  const fmtDate = useCallback(
    (date: Date | string | number, options?: DateFormatOptions) => formatDate(date, locale, options),
    [locale]
  );

  const fmtNumber = useCallback(
    (value: number, options?: NumberFormatOptions) => formatNumber(value, locale, options),
    [locale]
  );

  const fmtCurrency = useCallback(
    (value: number, options?: CurrencyFormatOptions) => formatCurrency(value, locale, options),
    [locale]
  );

  const fmtRelativeTime = useCallback(
    (date: Date | string | number) => formatRelativeTime(date, locale),
    [locale]
  );

  return { formatDate: fmtDate, formatNumber: fmtNumber, formatCurrency: fmtCurrency, formatRelativeTime: fmtRelativeTime, locale };
}

/* ── FormattedDate Component ── */
interface FormattedDateProps {
  value: Date | string | number;
  format?: DateFormatOptions["format"];
  includeTime?: boolean;
  className?: string;
}

export function FormattedDate({ value, format = "medium", includeTime = false, className }: FormattedDateProps) {
  const { locale } = useLocale();
  const formatted = formatDate(value, locale, { format, includeTime });
  const isoDate = new Date(value).toISOString();

  return (
    <time dateTime={isoDate} className={className}>
      {formatted}
    </time>
  );
}

/* ── FormattedNumber Component ── */
interface FormattedNumberProps {
  value: number;
  decimals?: number;
  style?: "decimal" | "percent";
  className?: string;
}

export function FormattedNumber({ value, decimals, style, className }: FormattedNumberProps) {
  const { locale } = useLocale();
  return <span className={className}>{formatNumber(value, locale, { decimals, style })}</span>;
}

/* ── FormattedCurrency Component ── */
interface FormattedCurrencyProps {
  value: number;
  currency?: string;
  className?: string;
}

export function FormattedCurrency({ value, currency, className }: FormattedCurrencyProps) {
  const { locale } = useLocale();
  return <span className={className}>{formatCurrency(value, locale, { currency })}</span>;
}

export default useFormatting;
