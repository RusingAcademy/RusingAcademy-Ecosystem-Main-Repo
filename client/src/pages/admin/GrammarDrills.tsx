
import { useState } from 'react';
import { PenTool, BookOpen, Target, BarChart3, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// TODO: import { trpc } from '@/lib/trpc';

// Mock Data
const mockStats = {
  totalDrills: 125,
  completionRate: 88,
  avgAccuracy: 92,
  popularTopics: ['Verb Conjugation', 'Prepositions', 'Articles'],
};

const mockDrills = [
  { id: 'drill-1', type: 'fill-blank', topic: 'Verb Conjugation', cefr: 'B1', difficulty: 'Intermediate' },
  { id: 'drill-2', type: 'conjugation', topic: 'Tenses', cefr: 'A2', difficulty: 'Beginner' },
  { id: 'drill-3', type: 'reorder', topic: 'Sentence Structure', cefr: 'B2', difficulty: 'Advanced' },
  { id: 'drill-4', type: 'multiple-choice', topic: 'Prepositions', cefr: 'B1', difficulty: 'Intermediate' },
];

const mockTopics = [
    { id: 'topic-1', name: 'Verb Conjugation' },
    { id: 'topic-2', name: 'Prepositions' },
    { id: 'topic-3', name: 'Articles' },
    { id: 'topic-4', name: 'Tenses' },
    { id: 'topic-5', name: 'Sentence Structure' },
];

const GrammarDrillsAdmin = () => {
  const [loading, setLoading] = useState(false);
  // TODO: const { data: stats, isLoading: statsLoading } = trpc.admin.grammarDrills.getStats.useQuery();
  const stats = mockStats;
  const statsLoading = false;

  // TODO: const { data: drills, isLoading: drillsLoading } = trpc.admin.grammarDrills.listDrills.useQuery();
  const drills = mockDrills;
  const drillsLoading = false;

  // TODO: const { data: topics, isLoading: topicsLoading } = trpc.admin.grammarDrills.listTopics.useQuery();
  const topics = mockTopics;
  const topicsLoading = false;

  const handleAddDrill = () => {
    toast.success('New drill added successfully!');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <PenTool className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Grammar Drills</h1>
            <p className="text-muted-foreground">Manage grammar drill exercises for learners.</p>
          </div>
        </div>
        <Button onClick={handleAddDrill}>
          <Plus className="mr-2 h-4 w-4" /> Add New Drill
        </Button>
      </div>

      {statsLoading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drills</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDrills}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgAccuracy}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drills">Drills</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
            {/* Overview content, like charts or more stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Popular Topics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {stats.popularTopics.map(topic => <Badge key={topic}>{topic}</Badge>)}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="drills" className="mt-4">
          {drillsLoading ? (
            <p>Loading drills...</p>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Manage Drills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drills.map((drill) => (
                    <div key={drill.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div>
                        <p className="font-semibold">{drill.topic}</p>
                        <p className="text-sm text-muted-foreground">Type: {drill.type} | CEFR: {drill.cefr} | Difficulty: {drill.difficulty}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="topics" className="mt-4">
            {topicsLoading ? (
                <p>Loading topics...</p>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                        {topics.map((topic) => (
                            <div key={topic.id} className="flex items-center justify-between p-2 border rounded-lg">
                                <p className="font-semibold">{topic.name}</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                                    <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Scoring</label>
                <Input placeholder="Configure scoring rules..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hints</label>
                <Input placeholder="Configure hint settings..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrammarDrillsAdmin;
