import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Layers, BookOpen, Brain, BarChart3, Plus, Trash2, Search, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";

const AdminFlashcards = () => {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("");

  const { data: stats, isLoading: isLoadingStats } = trpc.adminFlashcards.getStats.useQuery();
  const { data: decks, isLoading: isLoadingDecks, refetch: refetchDecks } = trpc.adminFlashcards.listDecks.useQuery({
    search: search || undefined,
    level: levelFilter || undefined,
  });
  const deleteDeckMutation = trpc.adminFlashcards.deleteDeck.useMutation({
    onSuccess: () => { toast.success("Deck deleted successfully"); refetchDecks(); },
    onError: (e) => toast.error(e.message),
  });
  const seedDeckMutation = trpc.adminFlashcards.createSeedDeck.useMutation({
    onSuccess: () => { toast.success("Seed deck created"); refetchDecks(); },
    onError: (e) => toast.error(e.message),
  });

  const handleSeedDeck = () => {
    seedDeckMutation.mutate({
      title: "SLE Oral B2 — Common Expressions",
      titleFr: "ELS Oral B2 — Expressions courantes",
      description: "Essential expressions for SLE oral exam preparation at B2 level",
      descriptionFr: "Expressions essentielles pour la préparation à l'examen oral ELS au niveau B2",
      cefrLevel: "B2",
      category: "SLE Oral",
      cards: [
        { front: "I'd like to bring up an important point.", back: "J'aimerais soulever un point important.", frontFr: "J'aimerais soulever un point important.", backFr: "I'd like to bring up an important point." },
        { front: "Could you elaborate on that?", back: "Pourriez-vous élaborer là-dessus?", frontFr: "Pourriez-vous élaborer là-dessus?", backFr: "Could you elaborate on that?" },
        { front: "In my experience...", back: "D'après mon expérience...", frontFr: "D'après mon expérience...", backFr: "In my experience..." },
        { front: "That's a valid concern.", back: "C'est une préoccupation valable.", frontFr: "C'est une préoccupation valable.", backFr: "That's a valid concern." },
        { front: "Let me rephrase that.", back: "Permettez-moi de reformuler.", frontFr: "Permettez-moi de reformuler.", backFr: "Let me rephrase that." },
      ],
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Layers className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Admin Flashcards</h1>
            <p className="text-muted-foreground">Manage flashcard decks and the spaced repetition system.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedDeck} disabled={seedDeckMutation.isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Seed SLE Deck
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="decks">Decks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {isLoadingStats ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Decks</CardTitle>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalDecks ?? 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCards ?? 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeUsers ?? 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Cards/Deck</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.avgCardsPerDeck ?? 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Mastery</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.avgMastery ?? 0}%</div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="decks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Flashcard Decks</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search decks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-60" />
                  </div>
                  <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
                    <option value="">All Levels</option>
                    {["A1","A2","B1","B2","C1"].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingDecks ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !decks || decks.length === 0 ? (
                <div className="text-center py-12">
                  <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No flashcard decks yet</h3>
                  <p className="text-muted-foreground mb-4">Click "Seed SLE Deck" to create a starter deck for learners.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(decks as any[]).map((deck: any) => (
                    <div key={deck.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div>
                        <h3 className="font-semibold">{deck.title}</h3>
                        {deck.titleFr && deck.titleFr !== deck.title && (
                          <p className="text-sm text-muted-foreground italic">{deck.titleFr}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{deck.cardCount ?? 0} cards</span>
                          <Badge variant="outline">{deck.cefrLevel}</Badge>
                          {deck.category && <Badge variant="secondary">{deck.category}</Badge>}
                          {deck.ownerName && <span>by {deck.ownerName}</span>}
                        </div>
                      </div>
                      <Button variant="destructive" size="icon"
                        onClick={() => { if (confirm("Delete this deck and all its cards?")) deleteDeckMutation.mutate({ id: deck.id }); }}
                        disabled={deleteDeckMutation.isPending}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
};

export default AdminFlashcards;
