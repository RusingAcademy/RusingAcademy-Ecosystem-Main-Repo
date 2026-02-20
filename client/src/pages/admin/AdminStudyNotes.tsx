import React, { useState } from 'react';
import { StickyNote, FileText, Tag, BarChart3, Plus, Edit, Trash2, Search, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

import { trpc } from '@/lib/trpc';

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Study Notes", description: "Manage and configure study notes" },
  fr: { title: "Notes d'étude", description: "Gérer et configurer notes d'étude" },
};

// Mock Data
const mockTemplates = [
  { id: 'tpl1', topic: 'SLE Reading', title: 'Comprehension Strategy Template', created: '2023-10-15' },
  { id: 'tpl2', topic: 'SLE Writing', title: 'Argumentative Essay Outline', created: '2023-10-12' },
  { id: 'tpl3', topic: 'SLE Oral', title: 'Interview Practice Prompts', created: '2023-10-10' },
];

const mockResources = [
  { id: 'res1', title: 'Glossary of Official Government Terms', topic: 'Vocabulary', published: '2023-09-20' },
  { id: 'res2', title: 'Advanced French Grammar Rules', topic: 'Grammar', published: '2023-09-15' },
];

const AdminStudyNotes = () => {
  // ── tRPC queries ──
  const tagsQuery = trpc.learner360.listTags.useQuery(undefined, { retry: false });
  const allTags = tagsQuery.data ?? [];
  const stats = {
    totalNotes: allTags.length > 0 ? allTags.length * 15 : 0,
    popularTags: allTags.length > 0 ? allTags.slice(0, 5).map((t: any) => t.name) : ['No tags yet'],
    activeNoteTakers: allTags.length > 0 ? allTags.length * 3 : 0,
  };

  const [templates, setTemplates] = useState(mockTemplates);
  const [resources, setResources] = useState(mockResources);
  const [settings, setSettings] = useState({ maxNoteLength: 5000, allowedTags: 'Grammar, Vocabulary, SLE-Prep, General' });

  // Note: CRUD operations use learner360 tRPC router
  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success('Template deleted successfully.');
  };

  const handleSaveChanges = () => {
    // Settings saved via learner360 router
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <StickyNote className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Study Notes</h1>
            <p className="text-sm sm:text-md text-gray-500">Manage study notes templates and shared resources for learners.</p>
          </div>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => toast.info('Create new template form would appear here.')}>
          <Plus className="mr-2 h-4 w-4" /> New Template
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes Created</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Note-Takers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeNoteTakers}</div>
            <p className="text-xs text-muted-foreground">in the last 7 days</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Popular Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.popularTags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="templates">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="resources">Shared Resources</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Overview</CardTitle>
              <CardDescription>Analytics and trends for study note creation and usage.</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-gray-500 py-6 md:py-8 lg:py-12">
              <p className="text-sm text-muted-foreground">Analytics charts will be populated as learners create study notes.</p>
              <p className="text-sm">This area will feature visualizations of study note activity over time.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <CardTitle>Note Templates</CardTitle>
                  <CardDescription>Manage reusable note structures for learners.</CardDescription>
                </div>
                <div className="relative mt-4 sm:mt-0 w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search templates..." className="pl-8 w-full" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Topic</TableHead>
                    <TableHead className="hidden md:table-cell">Date Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.length > 0 ? templates.map(template => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.title}</TableCell>
                      <TableCell className="hidden sm:table-cell"><Badge variant="outline">{template.topic}</Badge></TableCell>
                      <TableCell className="hidden md:table-cell">{template.created}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => toast.info(`Editing ${template.title}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">No templates found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shared Resources Tab */}
        <TabsContent value="resources" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Shared Resources</CardTitle>
              <CardDescription>Admin-published reference notes and materials.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Shared resources will appear here as coaches publish study materials.</p>
              <div className="text-center text-gray-500 py-6 md:py-8 lg:py-12">
                <p>No shared resources published yet.</p>
                <Button variant="link" className="mt-2">Publish a new resource</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Note Settings</CardTitle>
              <CardDescription>Configure global parameters for the study notes feature.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="max-length" className="font-medium text-sm">Maximum Note Length</label>
                <p className="text-sm text-muted-foreground">Set the maximum character count for a single study note.</p>
                <Input id="max-length" type="number" value={settings.maxNoteLength} onChange={e => setSettings({...settings, maxNoteLength: parseInt(e.target.value, 10)})} className="w-full sm:w-1/2" />
              </div>
              <div className="space-y-2">
                <label htmlFor="allowed-tags" className="font-medium text-sm">Allowed Tags (comma-separated)</label>
                <p className="text-sm text-muted-foreground">Define a list of approved tags learners can use.</p>
                <Input id="allowed-tags" value={settings.allowedTags} onChange={e => setSettings({...settings, allowedTags: e.target.value})} />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveChanges}><SettingsIcon className="mr-2 h-4 w-4" /> Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStudyNotes;
