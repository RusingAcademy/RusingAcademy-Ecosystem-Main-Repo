import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Library, BookOpen, Brain, Sparkles, Plus, Search, RefreshCw, Users } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function AdminVocabulary() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("");

  const { data: stats, isLoading: isLoadingStats } = trpc.adminVocabulary.getStats.useQuery();
  const { data: words, isLoading: isLoadingWords, refetch: refetchWords } = trpc.adminVocabulary.listWords.useQuery({
    search: search || undefined,
    level: levelFilter || undefined,
  });
  const { data: categories, isLoading: isLoadingCategories } = trpc.adminVocabulary.listCategories.useQuery();

  const seedMutation = trpc.adminVocabulary.seedWords.useMutation({
    onSuccess: (data) => { toast.success(`${data.inserted} SLE words seeded`); refetchWords(); },
    onError: (e) => toast.error(e.message),
  });

  const handleSeedWords = () => {
    seedMutation.mutate({
      words: [
        { word: "rendre compte", translation: "to report / to realize", category: "SLE Oral", cefrLevel: "B2", exampleSentence: "Je dois rendre compte de mes résultats.", exampleSentenceFr: "I must report on my results." },
        { word: "en ce qui concerne", translation: "regarding / as for", category: "SLE Written", cefrLevel: "B2", exampleSentence: "En ce qui concerne le budget, nous devons en discuter.", exampleSentenceFr: "Regarding the budget, we need to discuss it." },
        { word: "mettre en œuvre", translation: "to implement", category: "SLE Written", cefrLevel: "C1", exampleSentence: "Il faut mettre en œuvre cette politique.", exampleSentenceFr: "We must implement this policy." },
        { word: "prendre en charge", translation: "to take care of / to handle", category: "SLE Oral", cefrLevel: "B1", exampleSentence: "Je vais prendre en charge ce dossier.", exampleSentenceFr: "I will handle this file." },
        { word: "dans le cadre de", translation: "within the framework of", category: "SLE Written", cefrLevel: "C1", exampleSentence: "Dans le cadre de ce projet, nous allons collaborer.", exampleSentenceFr: "Within the framework of this project, we will collaborate." },
      ],
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Library className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vocabulary Builder</h1>
            <p className="text-muted-foreground">Manage vocabulary content, categories, and AI suggestions.</p>
          </div>
        </div>
        <Button onClick={handleSeedWords} disabled={seedMutation.isPending}>
          <Plus className="mr-2 h-4 w-4" /> Seed SLE Words
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Words</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : stats?.totalWords ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : stats?.activeUsers ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Mastery</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : `${stats?.avgMastery ?? 0}%`}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingCategories ? "..." : (categories as any[])?.length ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="word-bank">
        <TabsList>
          <TabsTrigger value="word-bank">Word Bank</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="word-bank" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Word Bank Management</CardTitle>
                  <CardDescription>Browse and manage vocabulary words across all learners.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search words..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-60" />
                  </div>
                  <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
                    <option value="">All Levels</option>
                    {["A1","A2","B1","B2","C1"].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingWords ? (
                <div className="flex items-center justify-center py-6 md:py-8 lg:py-12">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !words || (words as any[]).length === 0 ? (
                <div className="text-center py-6 md:py-8 lg:py-12 text-muted-foreground">
                  <BookOpen className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No vocabulary words yet</h3>
                  <p className="text-sm">Click "Seed SLE Words" to create starter vocabulary for learners.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Word</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Translation</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mastery</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md divide-y divide-gray-200">
                      {(words as any[]).map((w: any) => (
                        <tr key={w.id}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{w.word}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{w.translation}</td>
                          <td className="px-4 py-3"><Badge variant="outline">{w.cefrLevel || "—"}</Badge></td>
                          <td className="px-4 py-3 text-sm text-gray-500">{w.category || "—"}</td>
                          <td className="px-4 py-3">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className="bg-primary rounded-full h-2" style={{ width: `${Math.min(100, (w.masteryLevel || 0) * 20)}%` }} />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{w.ownerName || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Topic Categories</CardTitle>
              <CardDescription>Word distribution by category across all learners.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCategories ? (
                <div className="flex items-center justify-center py-6 md:py-8 lg:py-12">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !categories || (categories as any[]).length === 0 ? (
                <div className="text-center py-6 md:py-8 lg:py-12 text-muted-foreground">
                  <Library className="mx-auto h-12 w-12 mb-4" />
                  <p>No categories yet. Categories appear automatically as words are added.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(categories as any[]).map((cat: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div>
                        <p className="font-semibold">{cat.category || "Uncategorized"}</p>
                        <p className="text-sm text-muted-foreground">{cat.count} words</p>
                      </div>
                      <Badge variant="secondary">{cat.count} words</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
