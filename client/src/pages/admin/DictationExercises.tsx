import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Languages,
  Headphones,
  PenTool,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  FileAudio,
} from "lucide-react";
import { useState } from "react";

// TODO: Replace with trpc hooks once the router is available
// import { trpc } from "@/lib/trpc";

const mockExercises = [
  {
    id: "ex1",
    cefrLevel: "B1",
    sentence: "The quick brown fox jumps over the lazy dog.",
    audioUrl: "/audio/ex1.mp3",
    category: "Daily Life",
  },
  {
    id: "ex2",
    cefrLevel: "A2",
    sentence: "I am learning to speak French.",
    audioUrl: "/audio/ex2.mp3",
    category: "Professional",
  },
  {
    id: "ex3",
    cefrLevel: "B2",
    sentence: "The economic forecast for the next quarter is optimistic.",
    audioUrl: "/audio/ex3.mp3",
    category: "Academic",
  },
];

const mockCategories = [
  { id: "cat1", name: "Daily Life" },
  { id: "cat2", name: "Professional" },
  { id: "cat3", name: "Academic" },
];

export default function DictationExercises() {
  const [exercises, setExercises] = useState(mockExercises);
  const [categories, setCategories] = useState(mockCategories);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace with actual trpc query
  // const { data: stats, isLoading: isStatsLoading } = trpc.admin.dictation.getStats.useQuery();
  const stats = {
    totalExercises: 3,
    avgAccuracy: 85.4,
    completionRate: 76.2,
  };
  const isStatsLoading = false;

  const handleAddExercise = () => {
    toast.success("New exercise added successfully!");
    // In a real app, this would open a form/modal
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
    toast.info("Exercise deleted.");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Languages className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dictation Exercises</h1>
            <p className="text-muted-foreground">Manage dictation exercises for learners.</p>
          </div>
        </div>
        <Button onClick={handleAddExercise}>
          <Plus className="mr-2 h-4 w-4" />
          Add Exercise
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isStatsLoading ? "..." : stats.totalExercises}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isStatsLoading ? "..." : `${stats.avgAccuracy}%`}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isStatsLoading ? "..." : `${stats.completionRate}%`}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="exercises">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>High-level view of dictation exercise engagement and performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* TODO: Add charts and more detailed stats */}
                    <p>Detailed analytics and charts will be displayed here.</p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="exercises" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Exercises</CardTitle>
              <CardDescription>Add, edit, or remove dictation exercises.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading exercises...</p>
              ) : exercises.length === 0 ? (
                <div className="text-center py-6 md:py-8 lg:py-12">
                  <p className="text-muted-foreground">No exercises found.</p>
                  <Button onClick={handleAddExercise} className="mt-4">Add First Exercise</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentence</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CEFR</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audio</th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200">
                      {exercises.map((exercise) => (
                        <tr key={exercise.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exercise.sentence}</td>
                          <td className="px-6 py-4 whitespace-nowrap"><Badge>{exercise.cefrLevel}</Badge></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exercise.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button variant="outline" size="sm"><FileAudio className="h-4 w-4 mr-2" /> Play</Button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteExercise(exercise.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </td>
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
                    <CardTitle>Exercise Categories</CardTitle>
                    <CardDescription>Group exercises by topic for easier navigation.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* TODO: Implement CRUD for categories */}
                    <div className="flex items-center gap-2 mb-4">
                        <Input placeholder="New category name" className="max-w-xs" />
                        <Button>Add Category</Button>
                    </div>
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between p-2 border rounded-md">
                                <span>{cat.name}</span>
                                <div>
                                    <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure the dictation exercise module.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">Playback Speed Control</h4>
                        <p className="text-sm text-muted-foreground">Allow learners to adjust audio playback speed.</p>
                    </div>
                    {/* TODO: Add toggle switch component */}
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">Accent Helper</h4>
                        <p className="text-sm text-muted-foreground">Provide a tool to easily add accent marks.</p>
                    </div>
                    {/* TODO: Add toggle switch component */}
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
