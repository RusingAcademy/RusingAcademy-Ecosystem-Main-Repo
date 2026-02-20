import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Key, Plus, Shield, Copy, XCircle } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Public Api", description: "Manage and configure public api" },
  fr: { title: "Public Api", description: "Gérer et configurer public api" },
};

const AVAILABLE_SCOPES = [
  "courses:read", "courses:write", "learners:read", "learners:write",
  "sessions:read", "sessions:write", "analytics:read", "memberships:read",
];

export default function PublicApi() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["courses:read", "learners:read"]);
  const [newKey, setNewKey] = useState<string | null>(null);

  const { data: keys, refetch } = trpc.publicApi.listKeys.useQuery();
  const { data: stats } = trpc.publicApi.getUsageStats.useQuery();

  const createMutation = trpc.publicApi.createKey.useMutation({
    onSuccess: (data: any) => {
      setNewKey(data.key);
      toast.success("API key created — copy it now, it won't be shown again!");
      refetch();
    },
    onError: (e: any) => toast.error(e.message),
  });
  const revokeMutation = trpc.publicApi.revokeKey.useMutation({
    onSuccess: () => { toast.success("API key revoked"); refetch(); },
  });

  const toggleScope = (scope: string) => {
    setSelectedScopes(prev => prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Key className="h-6 w-6 text-amber-400" /> Public API v1
          </h2>
          <p className="text-slate-400 mt-1">Manage API keys and access for external integrations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            <span className="text-white font-bold">{stats?.activeKeys || 0}</span> active / <span className="text-white">{stats?.totalKeys || 0}</span> total keys
          </div>
          <Button onClick={() => { setShowForm(!showForm); setNewKey(null); }} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4 mr-2" /> New API Key
          </Button>
        </div>
      </div>

      {newKey && (
        <Card className="bg-green-900/30 border-green-700">
          <CardContent className="p-4">
            <p className="text-green-400 font-semibold mb-2">API Key Created — Copy it now!</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-slate-900 text-green-300 px-3 py-2 rounded font-mono text-sm break-all">{newKey}</code>
              <Button size="sm" onClick={() => { navigator.clipboard.writeText(newKey); toast.success("Copied!"); }} className="bg-green-700">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-green-500 mt-2">This key will not be shown again. Store it securely.</p>
          </CardContent>
        </Card>
      )}

      {showForm && !newKey && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader><CardTitle className="text-white">Create API Key</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Key name (e.g., Production Integration)" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-900 border-slate-600 text-white" />
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Scopes</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SCOPES.map(scope => (
                  <button key={scope} onClick={() => toggleScope(scope)} className={`px-3 py-1 rounded-full text-sm border ${selectedScopes.includes(scope) ? "bg-amber-600/30 border-amber-500 text-amber-300" : "bg-slate-900 border-slate-600 text-slate-400"}`}>
                    <Shield className="h-3 w-3 inline mr-1" />{scope}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={() => createMutation.mutate({ name, scopes: selectedScopes })} disabled={!name || createMutation.isPending} className="bg-amber-600 hover:bg-amber-700">
              {createMutation.isPending ? "Creating..." : "Generate API Key"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {keys?.map((key: any) => (
          <Card key={key.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${key.isActive ? "bg-amber-500/20" : "bg-slate-500/20"}`}>
                    <Key className={`h-5 w-5 ${key.isActive ? "text-amber-400" : "text-slate-400"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{key.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded">{key.keyPrefix}...</code>
                      <Badge className={key.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {key.isActive ? "Active" : "Revoked"}
                      </Badge>
                      <span className="text-xs text-slate-500">{key.rateLimit} req/min</span>
                    </div>
                  </div>
                </div>
                {key.isActive && (
                  <Button variant="ghost" size="sm" onClick={() => revokeMutation.mutate({ id: key.id })} className="text-red-400 hover:text-red-300">
                    <XCircle className="h-4 w-4 mr-1" /> Revoke
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {(!keys || keys.length === 0) && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center text-slate-400">
              No API keys yet. Create your first key to enable external integrations.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
