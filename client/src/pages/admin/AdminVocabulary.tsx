'''
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Library,
  BookOpen,
  Brain,
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import { useState } from "react";

// TODO: Replace with tRPC router when available
// import { trpc } from "@/lib/trpc";

const mockWords = [
  {
    id: "word1",
    french: "Bonjour",
    english: "Hello",
    partOfSpeech: "Interjection",
    cefrLevel: "A1",
    example: "Bonjour, comment ça va?",
    pronunciation: "/bɔ̃.ʒuʁ/",
  },
  {
    id: "word2",
    french: "Manger",
    english: "To eat",
    partOfSpeech: "Verb",
    cefrLevel: "A1",
    example: "Je vais manger une pomme.",
    pronunciation: "/mɑ̃.ʒe/",
  },
  {
    id: "word3",
    french: "Ordinateur",
    english: "Computer",
    partOfSpeech: "Noun",
    cefrLevel: "A2",
    example: "Mon ordinateur est rapide.",
    pronunciation: "/ɔʁ.di.na.tœʁ/",
  },
];

const mockCategories = [
  { id: "cat1", name: "Basics", wordCount: 150 },
  { id: "cat2", name: "Business", wordCount: 450 },
  { id: "cat3", name: "Technology", wordCount: 320 },
];

export default function AdminVocabulary() {
  // TODO: Replace with tRPC hooks
  // const { data: stats, isLoading: isLoadingStats } = trpc.admin.vocabulary.getStats.useQuery();
  // const { data: words, isLoading: isLoadingWords } = trpc.admin.vocabulary.listWords.useQuery();
  // const { data: categories, isLoading: isLoadingCategories } = trpc.admin.vocabulary.listCategories.useQuery();

  const [stats, setStats] = useState({ totalWords: 2500, mastery: { beginner: 1200, intermediate: 800, advanced: 500 }, popularCategories: ["Business", "Travel", "Technology"] });
  const [words, setWords] = useState(mockWords);
  const [categories, setCategories] = useState(mockCategories);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const handleAddWord = () => {
    toast.success("New word added successfully!");
    // TODO: Implement tRPC mutation for adding a word
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Library className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vocabulary Builder</h1>
            <p className="text-muted-foreground">
              Manage vocabulary content, categories, and AI suggestions.
            </p>
          </div>
        </div>
        <Button onClick={handleAddWord}>
          <Plus className="mr-2 h-4 w-4" /> Add New Word
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Words</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : stats?.totalWords || "N/A"}</div>
            <p className="text-xs text-muted-foreground">in the entire word bank</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mastery Distribution</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : `${Math.round((stats?.mastery.beginner / stats?.totalWords) * 100)}%`}</div>
            <p className="text-xs text-muted-foreground">Beginner level mastery across users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Categories</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="flex flex-wrap gap-2 mt-2">
              {(stats?.popularCategories || []).map(cat => <Badge key={cat} variant="secondary">{cat}</Badge>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="word-bank">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="word-bank">Word Bank</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Vocabulary Overview</CardTitle>
                    <CardDescription>High-level statistics and trends for the vocabulary builder feature.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingStats ? (
                        <p>Loading statistics...</p>
                    ) : (
                        <div className="text-center text-muted-foreground py-12">
                            <p>Detailed charts and graphs will be displayed here.</p>
                            <p className="text-sm">e.g., New words per week, user engagement, mastery progress over time.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="word-bank" className="mt-4">
          <Card>
            <CardHeader>
                <CardTitle>Word Bank Management</CardTitle>
                <CardDescription>Add, edit, or remove vocabulary words.</CardDescription>
                 <div className="pt-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search words..." className="pl-10" />
                </div>
            </CardHeader>
            <CardContent>
              {isLoadingWords ? (
                <p>Loading words...</p>
              ) : words.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">French</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part of Speech</th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {words.map((word) => (
                        <tr key={word.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{word.french}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{word.english}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={word.cefrLevel === 'A1' ? 'default' : 'secondary'}>{word.cefrLevel}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{word.partOfSpeech}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="mx-auto h-12 w-12" />
                  <h3 className="mt-2 text-sm font-medium">No words found</h3>
                  <p className="mt-1 text-sm">Get started by adding a new word.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
           <Card>
                <CardHeader>
                    <CardTitle>Topic Categories</CardTitle>
                    <CardDescription>Manage topic-based word groups for focused learning.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isLoadingCategories ? (
                        <p>Loading categories...</p>
                    ) : (
                        <div className="space-y-4">
                            {categories.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                                    <div>
                                        <p className="font-semibold">{cat.name}</p>
                                        <p className="text-sm text-muted-foreground">{cat.wordCount} words</p>
                                    </div>
                                    <div className="space-x-2">
                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="ai-suggestions" className="mt-4">
           <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Suggestions</CardTitle>
                    <CardDescription>Configure and review AI-generated vocabulary suggestions.</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground py-12">
                    <Sparkles className="mx-auto h-12 w-12" />
                    <h3 className="mt-2 text-sm font-medium">AI Configuration Panel</h3>
                    <p className="mt-1 text-sm">Settings for generating new words, example sentences, and categories will be available here.</p>
                    <Button className="mt-4">Configure AI</Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
'''" ))                 ]        }      ]    }  }}
