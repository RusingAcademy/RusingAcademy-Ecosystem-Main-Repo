/**
 * PWAInstallPrompt — Install CTA for Chrome/Android + iOS A2HS instructions.
 *
 * Behavior:
 * - Chrome/Android: Listens for `beforeinstallprompt`, shows a branded banner.
 * - iOS Safari: Detects UA and shows "Add to Home Screen" instructions.
 * - Already installed (standalone): Hides completely.
 * - Dismissible: User can close; remembers choice for 7 days via localStorage.
 */

import { useState, useEffect, useCallback } from "react";
import { X, Download, Share, Plus } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-install-dismissed";
const DISMISS_DAYS = 7;

function isDismissed(): boolean {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const ts = parseInt(raw, 10);
  if (isNaN(ts)) return false;
  return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true
  );
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Already installed or dismissed
    if (isStandalone() || isDismissed()) return;

    // iOS Safari — show A2HS instructions
    if (isIOS()) {
      setShowIOSGuide(true);
      return;
    }

    // Chrome / Android — listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShowBanner(false);
    setShowIOSGuide(false);
  }, []);

  // ── Chrome / Android Banner ──
  if (showBanner) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <button
            onClick={handleDismiss}
            className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foundation">
              <span className="text-lg font-bold text-[#E06B2D]">R</span>
            </div>
            <div className="flex-1 pr-6">
              <h3 className="text-sm font-semibold text-gray-900">
                Install RA Sales
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                Add to your home screen for quick access, offline support, and a native app experience.
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-foundation px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-foundation-2"
            >
              <Download size={16} />
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── iOS Safari A2HS Guide ──
  if (showIOSGuide) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <button
            onClick={handleDismiss}
            className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Dismiss install guide"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foundation">
              <span className="text-lg font-bold text-[#E06B2D]">R</span>
            </div>
            <div className="flex-1 pr-6">
              <h3 className="text-sm font-semibold text-gray-900">
                Install RA Sales
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                Get quick access from your home screen.
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0077C5]">
                <Share size={14} className="text-white" />
              </div>
              <p className="text-xs text-gray-700">
                <span className="font-medium">Step 1:</span> Tap the{" "}
                <strong>Share</strong> button in Safari's toolbar
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-foundation">
                <Plus size={14} className="text-white" />
              </div>
              <p className="text-xs text-gray-700">
                <span className="font-medium">Step 2:</span> Scroll down and tap{" "}
                <strong>"Add to Home Screen"</strong>
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="mt-3 w-full rounded-lg py-2 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-50"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return null;
}
