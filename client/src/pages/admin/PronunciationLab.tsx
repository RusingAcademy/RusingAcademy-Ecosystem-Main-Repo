
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Mic, Volume2, Languages, BarChart3, Plus, Edit, Trash2, Search } from 'lucide-react';

// TODO: Replace with tRPC router when available
// import { trpc } from '@/lib/trpc';

const mockExercises = [
  { id: '1', cefr: 'A2', phrase: 'Hello, how are you?', ipa: '/həˈloʊ, haʊ ɑːr juː/', audioUrl: '/audio/hello.mp3' },
  { id: '2', cefr: 'B1', phrase: 'I would like to book a table.', ipa: '/aɪ wʊd laɪk tuː bʊk ə ˈteɪbəl/', audioUrl: '/audio/book_table.mp3' },
  { id: '3', cefr: 'B2', phrase: 'The quick brown fox jumps over the lazy dog.', ipa: '/ðə kwɪk braʊn fɒks dʒʌmps ˈoʊvər ðə ˈleɪzi dɒɡ/', audioUrl: '/audio/quick_brown_fox.mp3' },
  { id: '4', cefr: 'C1', phrase: 'Existentialism is a humanism.', ipa: '/ˌɛɡzɪˈstɛnʃəˌlɪzəm ɪz ə ˈhjuːməˌnɪzəm/', audioUrl: '/audio/existentialism.mp3' },
];

const mockCategories = [
    { id: '1', name: 'Vowel Sounds /iː/ vs /ɪ/', count: 15 },
    { id: '2', name: 'Consonant Clusters /str/', count: 8 },
    { id: '3', name: 'Minimal Pairs /p/ vs /b/', count: 22 },
    { id: '4', name: 'Intonation Patterns', count: 12 },
];

const PronunciationLab = () => {
  const [exercises, setExercises] = useState(mockExercises);
  const [categories, setCategories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: Replace with tRPC query
  const { data: stats, isLoading: isLoadingStats } = {
      data: { totalExercises: 4, completionRate: 76, popularPhrase: 'Hello, how are you?' },
      isLoading: false
  };

  const handleAddExercise = () => {
    toast.success('New exercise added (mock)');
    // TODO: Implement tRPC mutation for adding exercise
  };

  const handleEditExercise = (id: string) => {
    toast.info(`Editing exercise ${id} (mock)`);
    // TODO: Implement tRPC mutation for editing exercise
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
    toast.error(`Deleted exercise ${id} (mock)`);
    // TODO: Implement tRPC mutation for deleting exercise
  };

  const filteredExercises = exercises.filter(e => 
    e.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.ipa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Mic className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Pronunciation Lab</h1>
            <p className="text-muted-foreground">Manage pronunciation exercises, categories, and settings.</p>
          </div>
        </div>
        <Button onClick={handleAddExercise}>
          <Plus className="mr-2 h-4 w-4" /> Add New Exercise
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
            <Languages className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? '...' : stats?.totalExercises}</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? '...' : `${stats?.completionRate}%`}</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular Phrase</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{isLoadingStats ? '...' : stats?.popularPhrase}</div>
            <p className="text-xs text-muted-foreground">Based on user practice sessions</p>
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
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>Detailed statistics and usage analytics.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* TODO: Add charts and more detailed stats */}
                    <div className="text-center text-muted-foreground py-6 md:py-8 lg:py-12">
                        <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                        <p>Detailed analytics and charts will be displayed here.</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="exercises" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Exercises</CardTitle>
              <CardDescription>Add, edit, or remove pronunciation exercises.</CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search exercises..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phrase</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IPA Transcription</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CEFR</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audio</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md divide-y divide-gray-200">
                    {filteredExercises.length > 0 ? filteredExercises.map((exercise) => (
                      <tr key={exercise.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exercise.phrase}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{exercise.ipa}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={exercise.cefr.startsWith('A') ? 'secondary' : exercise.cefr.startsWith('B') ? 'default' : 'destructive'}>{exercise.cefr}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Button variant="ghost" size="icon" onClick={() => new Audio(exercise.audioUrl).play()}>
                                <Volume2 className="h-4 w-4" />
                            </Button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="icon" onClick={() => handleEditExercise(exercise.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteExercise(exercise.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="text-center py-6 md:py-8 lg:py-12 text-muted-foreground">
                                <Mic className="mx-auto h-12 w-12 mb-4" />
                                <p>No exercises found. Start by adding a new one.</p>
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Exercise Categories</CardTitle>
                    <CardDescription>Group exercises by phonemes, minimal pairs, or other criteria.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg">
                                <div>
                                    <p className="font-medium">{cat.name}</p>
                                    <p className="text-sm text-muted-foreground">{cat.count} exercises</p>
                                </div>
                                <div>
                                    <Button variant="outline" size="sm">Manage</Button>
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
              <CardDescription>Configure the Pronunciation Lab module.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="tts-voice" className="text-sm font-medium">Text-to-Speech (TTS) Voice</label>
                    <Input id="tts-voice" defaultValue="alloy" />
                    <p className="text-sm text-muted-foreground">Select the default voice for audio generation.</p>
                </div>
                <div className="space-y-2">
                    <label htmlFor="scoring-threshold" className="text-sm font-medium">Scoring Threshold</label>
                    <Input id="scoring-threshold" type="number" defaultValue="80" />
                    <p className="text-sm text-muted-foreground">Minimum score (in %) required to pass an exercise.</p>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PronunciationLab;
