/**
 * Internationalization Components — Month 6 Polish, Scale & Launch
 * Barrel export for all i18n components and utilities
 */
export {
  useFormatting,
  formatDate,
  formatNumber,
  formatCurrency,
  formatRelativeTime,
  FormattedDate,
  FormattedNumber,
  FormattedCurrency,
  type DateFormatOptions,
  type NumberFormatOptions,
  type CurrencyFormatOptions,
} from "./FormatUtils";

export { TranslationAudit } from "./TranslationAudit";

export {
  LanguageSwitcher,
} from "./LanguageSwitcher";

export {
  FontPreloader,
  BilingualText,
  useFontOptimization,
  getWordBreakStyle,
  FONT_CONFIGS,
  FRENCH_DIACRITICS_TEST,
  type FontConfig,
} from "./FontOptimization";
