'''
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Layers, BookOpen, Brain, BarChart3, Plus, Edit, Trash2, RotateCcw } from "lucide-react";

// TODO: Replace with tRPC router once available
// import { trpc } from "@/lib/trpc";

const mockDecks = [
  { id: "deck1", title: "French Vocabulary - A1", cardCount: 50, cefrLevel: "A1", category: "Vocabulary" },
  { id: "deck2", title: "German Grammar - B2", cardCount: 120, cefrLevel: "B2", category: "Grammar" },
  { id: "deck3", title: "Spanish Conversation Starters", cardCount: 75, cefrLevel: "B1", category: "Conversation" },
];

const mockCards = {
  deck1: [
    { id: "card1", front: "Bonjour", back: "Hello", hint: "Greeting" },
    { id: "card2", front: "Merci", back: "Thank you", hint: "Gratitude" },
  ],
  deck2: [],
  deck3: [],
};

const AdminFlashcards = () => {
  // TODO: Replace useState with tRPC queries
  // const { data: stats, isLoading: isLoadingStats } = trpc.admin.getFlashcardStats.useQuery();
  // const { data: decks, isLoading: isLoadingDecks } = trpc.admin.listFlashcardDecks.useQuery();
  const [stats] = useState({ totalDecks: 3, totalCards: 245, activeLearners: 150, avgRetention: "85%" });
  const [decks, setDecks] = useState(mockDecks);
  const [selectedDeck, setSelectedDeck] = useState(mockDecks[0]);

  const isLoadingStats = false;
  const isLoadingDecks = false;

  const handleAddDeck = () => {
    // TODO: Implement tRPC mutation for adding a deck
    toast.success("New deck created successfully!");
  };

  const handleDeleteDeck = (deckId: string) => {
    // TODO: Implement tRPC mutation for deleting a deck
    setDecks(decks.filter(d => d.id !== deckId));
    toast.success("Deck deleted successfully!");
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
        <Button onClick={handleAddDeck}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Deck
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="decks">Decks</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {isLoadingStats ? (
            <p>Loading stats...</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Decks</CardTitle>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalDecks ?? 'N/A'}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCards ?? 'N/A'}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeLearners ?? 'N/A'}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Retention</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.avgRetention ?? 'N/A'}</div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="decks">
          <Card>
            <CardHeader>
              <CardTitle>Flashcard Decks</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingDecks ? (
                <p>Loading decks...</p>
              ) : (
                <div className="space-y-4">
                  {decks.map((deck) => (
                    <div key={deck.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-semibold">{deck.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{deck.cardCount} cards</span>
                          <Badge variant="outline">{deck.cefrLevel}</Badge>
                          <Badge variant="secondary">{deck.category}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteDeck(deck.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Cards in &quot;{selectedDeck?.title}&quot;</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* TODO: Implement card management UI */}
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Card management interface coming soon.</p>
                        <p className="text-sm text-muted-foreground">Select a deck from the 'Decks' tab to manage its cards.</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Spaced Repetition (SM-2) Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="interval1" className="block text-sm font-medium text-muted-foreground">First Review Interval (days)</label>
                <Input id="interval1" type="number" defaultValue={1} className="mt-1" />
              </div>
              <div>
                <label htmlFor="interval2" className="block text-sm font-medium text-muted-foreground">Second Review Interval (days)</label>
                <Input id="interval2" type="number" defaultValue={6} className="mt-1" />
              </div>
              <div>
                <label htmlFor="easeFactor" className="block text-sm font-medium text-muted-foreground">Default Ease Factor</label>
                <Input id="easeFactor" type="number" step="0.1" defaultValue={2.5} className="mt-1" />
              </div>
              <Button>
                <RotateCcw className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFlashcards;
'''
