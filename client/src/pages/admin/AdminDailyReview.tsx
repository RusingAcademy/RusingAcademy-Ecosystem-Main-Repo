
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { RotateCcw, Bell, BarChart3, TrendingUp, Settings, Calendar, PlusCircle } from 'lucide-react';
import React, { useState } from 'react';

// TODO: Replace with tRPC hooks once the router is available
// import { trpc } from "@/lib/trpc";

const AdminDailyReview = () => {
  const [stats, setStats] = useState({ activeReviewers: 12, cardsDueToday: 152, avgCompletionRate: 88, streakDistribution: 'N/A' });
  const [config, setConfig] = useState({ initialInterval: 1, easeFactorMin: 1.3, easeFactorMax: 2.5, graduatingInterval: 4 });
  const [notifications, setNotifications] = useState({ remindersEnabled: true, reminderTime: '09:00' });

  // TODO: Replace with tRPC query
  // const { data: statsData, isLoading: isStatsLoading } = trpc.admin.getDailyReviewStats.useQuery();

  // TODO: Replace with tRPC mutation
  // const updateConfig = trpc.admin.updateDailyReviewConfig.useMutation({
  //   onSuccess: () => toast.success('Configuration updated successfully!'),
  //   onError: () => toast.error('Failed to update configuration.'),
  // });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <RotateCcw className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Admin Daily Review</h1>
            <p className="text-muted-foreground">Manage the daily review queue system.</p>
          </div>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Action
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reviewers</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReviewers}</div>
            <p className="text-xs text-muted-foreground">Currently reviewing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Due Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cardsDueToday}</div>
            <p className="text-xs text-muted-foreground">In the next 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">Over the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak Distribution</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streakDistribution}</div>
            <p className="text-xs text-muted-foreground">Average review streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Interface */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="queue-config">Queue Config</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-12">
              <p>Overview statistics will be displayed here.</p>
              <p className="text-sm">TODO: Implement charts for streak distribution and completion rates.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="queue-config">
          <Card>
            <CardHeader>
              <CardTitle>Queue Configuration</CardTitle>
              <p className="text-muted-foreground text-sm">Adjust the SM-2 algorithm parameters.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="initial-interval">Initial Interval (days)</label>
                <Input id="initial-interval" type="number" className="w-24" value={config.initialInterval} onChange={(e) => setConfig({...config, initialInterval: Number(e.target.value)})} />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="ease-factor-min">Ease Factor (Min)</label>
                <Input id="ease-factor-min" type="number" step="0.1" className="w-24" value={config.easeFactorMin} onChange={(e) => setConfig({...config, easeFactorMin: Number(e.target.value)})} />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="ease-factor-max">Ease Factor (Max)</label>
                <Input id="ease-factor-max" type="number" step="0.1" className="w-24" value={config.easeFactorMax} onChange={(e) => setConfig({...config, easeFactorMax: Number(e.target.value)})} />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="graduating-interval">Graduating Interval (days)</label>
                <Input id="graduating-interval" type="number" className="w-24" value={config.graduatingInterval} onChange={(e) => setConfig({...config, graduatingInterval: Number(e.target.value)})} />
              </div>
               <Button className="mt-4" onClick={() => { /* updateConfig.mutate(config) */ toast.info('Settings saved (mock)!'); }}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
               <p className="text-muted-foreground text-sm">Manage review reminder notifications.</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <p>Enable daily review reminders</p>
                    <Button variant="outline" onClick={() => setNotifications({...notifications, remindersEnabled: !notifications.remindersEnabled})}>{notifications.remindersEnabled ? 'Disable' : 'Enable'}</Button>
                </div>
                <div className="flex items-center justify-between">
                    <p>Reminder time</p>
                    <Input type="time" className="w-32" value={notifications.reminderTime} onChange={(e) => setNotifications({...notifications, reminderTime: e.target.value})} />
                </div>
                 <Button className="mt-4" onClick={() => { /* updateNotifications.mutate(notifications) */ toast.info('Notification settings saved (mock)!'); }}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-12">
              <p>Retention curves and review patterns will be displayed here.</p>
              <p className="text-sm">TODO: Implement analytics charts.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDailyReview;
