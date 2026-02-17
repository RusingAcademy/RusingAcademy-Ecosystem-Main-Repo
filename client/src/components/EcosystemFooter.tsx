import { Link } from 'wouter';
import { brandColors } from '../lib/ecosystem-design-system';

interface EcosystemFooterProps {
  lang: 'en' | 'fr';
  theme: 'glass' | 'light';
  activeBrand?: 'rusingacademy' | 'lingueefy' | 'barholexMedia' | 'ecosystem';
}

const labels = {
  en: {
    ecosystem: 'Ecosystem',
    rusingacademy: 'RusingAcademy',
    lingueefy: 'Lingueefy',
    barholex: 'Barholex Media',
    legal: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    accessibility: 'Accessibility',
    contact: 'Contact',
    copyright: '© 2026 Rusinga International Consulting Ltd. All rights reserved.',
    location: 'Ottawa, Ontario, Canada',
    tagline: 'Empowering Canadian public servants with bilingual excellence through innovative learning, expert coaching, and premium media production.',
  },
  fr: {
    ecosystem: 'Écosystème',
    rusingacademy: 'RusingAcademy',
    lingueefy: 'Lingueefy',
    barholex: 'Barholex Media',
    legal: 'Légal',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions d\'utilisation',
    accessibility: 'Accessibilité',
    contact: 'Contact',
    copyright: '© 2026 Rusinga International Consulting Ltd. Tous droits réservés.',
    location: 'Ottawa, Ontario, Canada',
    tagline: 'Permettre aux fonctionnaires canadiens d\'atteindre l\'excellence bilingue grâce à un apprentissage innovant, un coaching expert et une production média premium.',
  },
};

export function EcosystemFooter({ lang, theme, activeBrand = 'ecosystem' }: EcosystemFooterProps) {
  const t = labels[lang];
  const isGlass = theme === 'glass';
  const brandStyle = brandColors[activeBrand];

  return (
    <footer
      className={`relative py-16 ${
        isGlass
          ? 'bg-obsidian/80 border-t border-white/60'
          : 'bg-white dark:bg-card border-t border-gray-200'
      }`}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(ellipse at bottom, ${brandStyle.glow} 0%, transparent 70%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: brandStyle.gradient }}
              >
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <h3 className={`font-bold ${isGlass ? 'text-white' : 'text-black'}`}>
                  Rusinga International Consulting Ltd.
                </h3>
              </div>
            </div>
            <p className={`text-sm leading-relaxed max-w-md ${isGlass ? 'text-white/90' : 'text-black'}`}>
              {t.tagline}
            </p>
            <p className={`text-sm mt-4 ${isGlass ? 'text-white/90' : 'text-black'}`}>
              {t.location}
            </p>
          </div>

          {/* Ecosystem Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isGlass ? 'text-white' : 'text-black'}`}>
              {t.ecosystem}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/rusingacademy"
                  className={`text-sm transition-colors hover:underline ${
                    isGlass ? 'text-white/90 hover:text-orange-400' : 'text-black dark:text-foreground hover:text-orange-600'
                  }`}
                  style={{ color: activeBrand === 'rusingacademy' ? brandColors.rusingacademy.primary : undefined }}
                >
                  {t.rusingacademy}
                </Link>
              </li>
              <li>
                <Link
                  href="/ecosystem"
                  className={`text-sm transition-colors hover:underline ${
                    isGlass ? 'text-white/90 hover:text-teal-400' : 'text-black dark:text-foreground hover:text-teal-600'
                  }`}
                  style={{ color: activeBrand === 'lingueefy' ? brandColors.lingueefy.primary : undefined }}
                >
                  {t.lingueefy}
                </Link>
              </li>
              <li>
                <Link
                  href="/barholex-media"
                  className={`text-sm transition-colors hover:underline ${
                    isGlass ? 'text-white/90 hover:text-foundation' : 'text-black dark:text-foreground hover:text-foundation'
                  }`}
                  style={{ color: activeBrand === 'barholexMedia' ? brandColors.barholexMedia.primary : undefined }}
                >
                  {t.barholex}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isGlass ? 'text-white' : 'text-black'}`}>
              {t.legal}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className={`text-sm transition-colors hover:underline ${
                    isGlass ? 'text-white/90 hover:text-white' : 'text-black dark:text-foreground hover:text-black'
                  }`}
                >
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className={`text-sm transition-colors hover:underline ${
                    isGlass ? 'text-white/90 hover:text-white' : 'text-black dark:text-foreground hover:text-black'
                  }`}
                >
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className={`text-sm transition-colors hover:underline ${
                    isGlass ? 'text-white/90 hover:text-white' : 'text-black dark:text-foreground hover:text-black'
                  }`}
                >
                  {t.accessibility}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`pt-8 border-t ${isGlass ? 'border-white/60' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-sm ${isGlass ? 'text-white/90' : 'text-black'}`}>
              {t.copyright}
            </p>
            
            {/* Ecosystem brand badges */}
            <div className="flex items-center gap-4">
              <Link href="/rusingacademy">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                  style={{ background: brandColors.rusingacademy.gradient }}
                  title="RusingAcademy"
                >
                  <span className="text-white text-xs font-bold">RA</span>
                </div>
              </Link>
              <Link href="/ecosystem">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                  style={{ background: brandColors.lingueefy.gradient }}
                  title="Lingueefy"
                >
                  <span className="text-white text-xs font-bold">L</span>
                </div>
              </Link>
              <Link href="/barholex-media">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                  style={{ background: brandColors.barholexMedia.gradient }}
                  title="Barholex Media"
                >
                  <span className="text-white text-xs font-bold">BM</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
