import { usePrompts } from '@/hooks/usePrompts';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Repeat, Download } from 'lucide-react';

const Dashboard = () => {
  const { allPrompts, allTags } = usePrompts();

  // Calculate all metrics
  const stats = {
    totalPrompts: allPrompts.length,
    totalUsage: allPrompts.reduce((sum, p) => sum + p.usageCount, 0),
    mostUsedTags: allTags.slice(0, 5),
    recentActivity: allPrompts.filter(p => {
      const daysDiff = (new Date().getTime() - p.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length,
    // Additional metrics
    numberOfInstalls: 1247, // Mock data - would come from analytics
    dailyActiveUsers: 89, // Mock data - would come from analytics
    promptReuseRate: Math.round((allPrompts.filter(p => p.usageCount > 1).length / Math.max(allPrompts.length, 1)) * 100)
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview of your PromptHive analytics and usage statistics
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Prompts</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalPrompts}</div>
              <p className="text-xs text-muted-foreground">All time collection</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Usage</CardTitle>
              <Repeat className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalUsage}</div>
              <p className="text-xs text-muted-foreground">Times prompts used</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Daily Active Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.dailyActiveUsers}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Installs</CardTitle>
              <Download className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.numberOfInstalls}</div>
              <p className="text-xs text-muted-foreground">Total downloads</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Recent Activity</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.recentActivity}</div>
              <p className="text-sm text-muted-foreground">New or updated prompts</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Prompt Reuse Rate</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.promptReuseRate}%</div>
              <p className="text-sm text-muted-foreground">Prompts used multiple times</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Most Used Tags</CardTitle>
              <CardDescription>Top performing categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.mostUsedTags.length > 0 ? (
                  stats.mostUsedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No tags used yet</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;