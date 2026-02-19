// client/src/components/admin/FeatureFlagsManager.tsx — Phase 4: Admin Feature Flags UI
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocale } from "@/i18n/LocaleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Flag, Plus, Trash2, History, Settings } from "lucide-react";

export default function FeatureFlagsManager() {
  const { locale } = useLocale();
  const isFr = locale === "fr";
  const utils = trpc.useUtils();

  const { data: flags, isLoading } = trpc.featureFlags.list.useQuery();
  const toggleMutation = trpc.featureFlags.toggle.useMutation({
    onSuccess: () => utils.featureFlags.list.invalidate(),
  });
  const deleteMutation = trpc.featureFlags.delete.useMutation({
    onSuccess: () => utils.featureFlags.list.invalidate(),
  });
  const createMutation = trpc.featureFlags.create.useMutation({
    onSuccess: () => {
      utils.featureFlags.list.invalidate();
      setShowCreate(false);
      resetForm();
    },
  });

  const [showCreate, setShowCreate] = useState(false);
  const [newFlag, setNewFlag] = useState({
    key: "",
    name: "",
    description: "",
    environment: "all" as const,
    rolloutPercentage: 100,
  });

  const resetForm = () => setNewFlag({ key: "", name: "", description: "", environment: "all", rolloutPercentage: 100 });

  const envColors: Record<string, string> = {
    all: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    development: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    staging: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    production: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  if (isLoading) return <div className="flex items-center justify-center p-8"><Settings className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{isFr ? "Feature Flags" : "Feature Flags"}</h2>
          <p className="text-muted-foreground">{isFr ? "Activer/désactiver les fonctionnalités" : "Enable/disable features"}</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{isFr ? "Créer un flag" : "Create Flag"}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isFr ? "Nouveau Feature Flag" : "New Feature Flag"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="key (e.g. chat.enabled)" value={newFlag.key} onChange={(e) => setNewFlag({ ...newFlag, key: e.target.value })} />
              <Input placeholder={isFr ? "Nom" : "Name"} value={newFlag.name} onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })} />
              <Textarea placeholder="Description" value={newFlag.description} onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })} />
              <Select value={newFlag.environment} onValueChange={(v: any) => setNewFlag({ ...newFlag, environment: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isFr ? "Tous" : "All"}</SelectItem>
                  <SelectItem value="development">{isFr ? "Développement" : "Development"}</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <span className="text-sm">{isFr ? "Déploiement" : "Rollout"}: {newFlag.rolloutPercentage}%</span>
                <Input type="range" min={0} max={100} value={newFlag.rolloutPercentage} onChange={(e) => setNewFlag({ ...newFlag, rolloutPercentage: Number(e.target.value) })} />
              </div>
              <Button className="w-full" onClick={() => createMutation.mutate(newFlag)} disabled={!newFlag.key || !newFlag.name || createMutation.isPending}>
                {createMutation.isPending ? (isFr ? "Création..." : "Creating...") : (isFr ? "Créer" : "Create")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!flags || flags.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Flag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{isFr ? "Aucun feature flag configuré" : "No feature flags configured"}</p>
            <Button variant="outline" className="mt-4" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4 mr-2" />{isFr ? "Créer le premier" : "Create first one"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {flags.map((flag: any) => (
            <Card key={flag.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{flag.key}</code>
                    <Badge className={envColors[flag.environment] || envColors.all}>{flag.environment}</Badge>
                    {flag.rolloutPercentage < 100 && (
                      <Badge variant="outline">{flag.rolloutPercentage}%</Badge>
                    )}
                  </div>
                  <p className="font-medium mt-1">{flag.name}</p>
                  {flag.description && <p className="text-sm text-muted-foreground">{flag.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={(checked: boolean) => toggleMutation.mutate({ id: flag.id, enabled: checked })}
                  />
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm(isFr ? "Supprimer ce flag ?" : "Delete this flag?")) deleteMutation.mutate({ id: flag.id }); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
