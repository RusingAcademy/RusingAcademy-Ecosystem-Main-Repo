import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Theme Customizer", description: "Manage and configure theme customizer" },
  fr: { title: "Theme Customizer", description: "Gérer et configurer theme customizer" },
};

const DEFAULT_TOKENS = {
  primaryColor: "#14b8a6",
  secondaryColor: "#6366f1",
  backgroundColor: "#0f172a",
  surfaceColor: "#1e293b",
  textColor: "#f8fafc",
  fontFamily: "Inter, sans-serif",
  borderRadius: "8px",
};

export default function ThemeCustomizer() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const [presetName, setPresetName] = useState("");
  const presetsQuery = trpc.themeCustomizer.list.useQuery(undefined, { retry: false });
  const createMutation = trpc.themeCustomizer.create.useMutation({
    onSuccess: () => { toast.success("Theme preset created"); presetsQuery.refetch(); },
    onError: (e: { message: string }) => toast.error(e.message),
  });
  const activateMutation = trpc.themeCustomizer.activate.useMutation({
    onSuccess: () => { toast.success("Theme activated"); presetsQuery.refetch(); },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Theme Customizer</h1>
        <span className="px-3 py-1 text-xs rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">Phase 9</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Design Tokens</h2>
          {Object.entries(tokens).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <label className="text-sm text-slate-300 w-40 capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
              {key.includes("Color") ? (
                <div className="flex items-center gap-2">
                  <input type="color" value={value} onChange={(e) => setTokens({ ...tokens, [key]: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
                  <input type="text" value={value} onChange={(e) => setTokens({ ...tokens, [key]: e.target.value })} className="bg-slate-700 text-white px-3 py-1.5 rounded text-sm w-28" />
                </div>
              ) : (
                <input type="text" value={value} onChange={(e) => setTokens({ ...tokens, [key]: e.target.value })} className="bg-slate-700 text-white px-3 py-2 rounded text-sm flex-1" />
              )}
            </div>
          ))}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
            <input type="text" placeholder="Preset name" value={presetName} onChange={(e) => setPresetName(e.target.value)} className="bg-slate-700 text-white px-3 py-2 rounded text-sm flex-1" />
            <button onClick={() => { if (presetName) createMutation.mutate({ name: presetName, slug: presetName.toLowerCase().replace(/\s+/g, "-"), tokens }); }} className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded text-sm font-medium">Save Preset</button>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Live Preview</h2>
          <div className="rounded-lg overflow-hidden border border-slate-600" style={{ backgroundColor: tokens.backgroundColor, fontFamily: tokens.fontFamily }}>
            <div className="p-4" style={{ backgroundColor: tokens.surfaceColor }}>
              <h3 className="text-lg font-bold" style={{ color: tokens.primaryColor }}>RusingAcademy</h3>
              <p className="text-sm mt-1" style={{ color: tokens.textColor }}>Preview of your theme customization</p>
            </div>
            <div className="p-4 space-y-3">
              <button style={{ backgroundColor: tokens.primaryColor, borderRadius: tokens.borderRadius, color: "#fff" }} className="px-4 py-2 text-sm font-medium">Primary Button</button>
              <button style={{ backgroundColor: tokens.secondaryColor, borderRadius: tokens.borderRadius, color: "#fff" }} className="px-4 py-2 text-sm font-medium ml-2">Secondary</button>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-white pt-4">Saved Presets</h2>
          {presetsQuery.data?.map((preset: { id: number; name: string; isActive: boolean }) => (
            <div key={preset.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
              <span className="text-white text-sm">{preset.name}</span>
              <div className="flex items-center gap-2">
                {preset.isActive && <span className="text-xs text-teal-400">Active</span>}
                <button onClick={() => activateMutation.mutate({ id: preset.id })} className="px-3 py-1 text-xs bg-teal-600/20 text-teal-400 rounded hover:bg-teal-600/30">Activate</button>
              </div>
            </div>
          ))}
          {presetsQuery.error && <p className="text-sm text-amber-400">Feature flag not enabled. Enable THEME_CUSTOMIZER_ENABLED to use.</p>}
        </div>
      </div>
    </div>
  );
}
