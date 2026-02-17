/**
 * Study Groups — Collaborative learning for SLE preparation
 * Wave F: Full bilingual (EN/FR), WCAG 2.1 AA accessibility, professional empty states
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function StudyGroups() {
  const { t, language } = useLanguage();
  const isFr = language === "fr";
  const [activeTab, setActiveTab] = useState("browse");
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cefrLevel, setCefrLevel] = useState("B1");
  const [maxMembers, setMaxMembers] = useState(10);

  const publicGroups = trpc.studyGroups.getPublic.useQuery();
  const myGroups = trpc.studyGroups.getMine.useQuery();
  const createGroup = trpc.studyGroups.create.useMutation({
    onSuccess: () => {
      toast.success(isFr ? "Groupe d'étude créé !" : "Study group created!");
      setShowCreate(false);
      setName("");
      setDescription("");
      publicGroups.refetch();
      myGroups.refetch();
    },
  });
  const joinGroup = trpc.studyGroups.join.useMutation({
    onSuccess: () => { toast.success(isFr ? "Groupe rejoint !" : "Joined group!"); myGroups.refetch(); publicGroups.refetch(); },
  });
  const leaveGroup = trpc.studyGroups.leave.useMutation({
    onSuccess: () => { toast.success(isFr ? "Groupe quitté" : "Left group"); myGroups.refetch(); publicGroups.refetch(); },
  });

  const myGroupIds = new Set(myGroups.data?.map(g => g.id) || []);
  const levels = ["A1", "A2", "B1", "B2", "C1"];

  return (
    <div className="container max-w-5xl py-8 space-y-6" role="main" aria-label={t("studyGroups.title")}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-foreground">{t("studyGroups.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {isFr
              ? "Apprenez ensemble avec des collègues fonctionnaires qui se préparent à l'ELS"
              : "Learn together with fellow public servants preparing for the SLE"}
          </p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}
          aria-expanded={showCreate}
          className="focus:outline-none focus:ring-2 focus:ring-teal-700/30">
          {showCreate
            ? (isFr ? "Annuler" : "Cancel")
            : (isFr ? "+ Créer un groupe" : "+ Create Group")}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>{isFr ? "Créer un groupe d'étude" : "Create a Study Group"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="group-name" className="text-sm font-medium">
                {isFr ? "Nom du groupe" : "Group Name"}
              </label>
              <Input id="group-name" value={name} onChange={e => setName(e.target.value)}
                placeholder={isFr ? "ex. Préparation ELS B2 — Ottawa" : "e.g., SLE B2 Prep — Ottawa"}
                className="mt-1" />
            </div>
            <div>
              <label htmlFor="group-desc" className="text-sm font-medium">
                {isFr ? "Description" : "Description"}
              </label>
              <textarea
                id="group-desc"
                className="w-full mt-1 p-3 border rounded-lg bg-background resize-none h-24 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={isFr ? "Décrivez le focus et les objectifs de votre groupe..." : "Describe your group's focus and goals..."}
              />
            </div>
            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="text-sm font-medium">{isFr ? "Niveau CECR" : "CEFR Level"}</label>
                <div className="flex gap-2 mt-1" role="radiogroup" aria-label={isFr ? "Niveau CECR" : "CEFR Level"}>
                  {levels.map(l => (
                    <Button key={l} size="sm" variant={cefrLevel === l ? "default" : "outline"}
                      onClick={() => setCefrLevel(l)}
                      role="radio" aria-checked={cefrLevel === l}
                      className="focus:outline-none focus:ring-2 focus:ring-teal-700/30">
                      {l}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="max-members" className="text-sm font-medium">
                  {isFr ? "Membres max." : "Max Members"}
                </label>
                <Input id="max-members" type="number" min={2} max={50} value={maxMembers}
                  onChange={e => setMaxMembers(Number(e.target.value))} className="mt-1 w-24" />
              </div>
            </div>
            <Button onClick={() => createGroup.mutate({ name, description, cefrLevel, maxMembers })}
              disabled={!name.trim() || createGroup.isPending}
              className="focus:outline-none focus:ring-2 focus:ring-teal-700/30">
              {createGroup.isPending
                ? (isFr ? "Création..." : "Creating...")
                : (isFr ? "Créer le groupe" : "Create Group")}
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="browse">
            {isFr ? "Parcourir les groupes" : "Browse Groups"} ({publicGroups.data?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="mine">
            {isFr ? "Mes groupes" : "My Groups"} ({myGroups.data?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {publicGroups.isLoading ? (
            <Card>
              <CardContent className="py-6 md:py-8 lg:py-12 text-center" role="status">
                <div className="animate-spin w-8 h-8 border-2 border-teal-700 border-t-transparent rounded-full mx-auto" />
                <p className="text-sm text-muted-foreground mt-3">{t("skillLabs.loading")}</p>
              </CardContent>
            </Card>
          ) : !publicGroups.data?.length ? (
            <Card>
              <CardContent className="py-6 md:py-8 lg:py-12 text-center" role="status">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  <span className="material-icons text-lg md:text-2xl lg:text-3xl text-blue-400" aria-hidden="true">groups</span>
                </div>
                <h3 className="font-semibold text-gray-700">
                  {isFr ? "Aucun groupe d'étude pour le moment" : "No study groups yet"}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {isFr ? "Soyez le premier à créer un groupe d'étude !" : "Be the first to create a study group!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label={isFr ? "Groupes publics" : "Public groups"}>
              {publicGroups.data.map(group => (
                <Card key={group.id} className="hover:shadow-md transition-all" role="listitem">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        {group.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{group.description}</p>
                        )}
                      </div>
                      <Badge>{group.cefrLevel}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {isFr ? `Max ${group.maxMembers} membres` : `Max ${group.maxMembers} members`}
                      </span>
                      {myGroupIds.has(group.id) ? (
                        <Button size="sm" variant="outline"
                          onClick={() => leaveGroup.mutate({ groupId: group.id })}
                          aria-label={isFr ? `Quitter ${group.name}` : `Leave ${group.name}`}
                          className="focus:outline-none focus:ring-2 focus:ring-red-300">
                          {isFr ? "Quitter" : "Leave"}
                        </Button>
                      ) : (
                        <Button size="sm"
                          onClick={() => joinGroup.mutate({ groupId: group.id })}
                          aria-label={isFr ? `Rejoindre ${group.name}` : `Join ${group.name}`}
                          className="focus:outline-none focus:ring-2 focus:ring-teal-700/30">
                          {isFr ? "Rejoindre" : "Join"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine" className="space-y-4">
          {myGroups.isLoading ? (
            <Card>
              <CardContent className="py-6 md:py-8 lg:py-12 text-center" role="status">
                <div className="animate-spin w-8 h-8 border-2 border-teal-700 border-t-transparent rounded-full mx-auto" />
                <p className="text-sm text-muted-foreground mt-3">{t("skillLabs.loading")}</p>
              </CardContent>
            </Card>
          ) : !myGroups.data?.length ? (
            <Card>
              <CardContent className="py-6 md:py-8 lg:py-12 text-center" role="status">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                  <span className="material-icons text-lg md:text-2xl lg:text-3xl text-teal-700/60" aria-hidden="true">group_add</span>
                </div>
                <h3 className="font-semibold text-gray-700">
                  {isFr ? "Vous n'avez rejoint aucun groupe" : "You haven't joined any groups yet"}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {isFr ? "Parcourez les groupes publics ou créez le vôtre" : "Browse public groups or create your own"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3" role="list" aria-label={isFr ? "Mes groupes" : "My groups"}>
              {myGroups.data.map(group => (
                <Card key={group.id} role="listitem">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{group.cefrLevel}</Badge>
                        <Button size="sm" variant="outline"
                          onClick={() => leaveGroup.mutate({ groupId: group.id })}
                          aria-label={isFr ? `Quitter ${group.name}` : `Leave ${group.name}`}
                          className="focus:outline-none focus:ring-2 focus:ring-red-300">
                          {isFr ? "Quitter" : "Leave"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
