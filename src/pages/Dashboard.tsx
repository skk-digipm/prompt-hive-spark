import { useState } from 'react';
import { usePrompts } from '@/hooks/usePrompts';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Users, Repeat, Download, ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { allPrompts, allTags } = usePrompts();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('all-time');

  // Filter prompts based on selected time period
  const getFilteredPrompts = () => {
    const now = new Date();
    let cutoffDate: Date;

    switch (timeFilter) {
      case '24h':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'yearly':
        cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        return allPrompts;
    }

    return allPrompts.filter(p => new Date(p.updatedAt) >= cutoffDate);
  };

  const filteredPrompts = getFilteredPrompts();

  // Calculate metrics based on filtered data
  const getFilteredRecentActivity = () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    return filteredPrompts.filter(p => new Date(p.updatedAt) >= cutoffDate).length;
  };

  const stats = {
    totalPrompts: filteredPrompts.length,
    totalUsage: filteredPrompts.reduce((sum, p) => sum + p.usageCount, 0),
    mostUsedTags: allTags.slice(0, 5),
    recentActivity: getFilteredRecentActivity(),
    // Additional metrics - these would vary based on time filter in real app
    numberOfInstalls: timeFilter === 'all-time' ? 1247 : timeFilter === 'yearly' ? 1200 : timeFilter === 'monthly' ? 150 : timeFilter === 'weekly' ? 35 : 12,
    dailyActiveUsers: timeFilter === 'all-time' ? 89 : timeFilter === 'yearly' ? 85 : timeFilter === 'monthly' ? 72 : timeFilter === 'weekly' ? 45 : 18,
    promptReuseRate: Math.round((filteredPrompts.filter(p => p.usageCount > 1).length / Math.max(filteredPrompts.length, 1)) * 100)
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Time Filter and Home Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Overview of your PromptHive analytics and usage statistics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/prompts')}
              className="flex items-center gap-2"
              title="Back to Prompts"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
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
              <p className="text-xs text-muted-foreground">
                {timeFilter === 'all-time' ? 'All time collection' : 
                 timeFilter === 'yearly' ? 'This year' :
                 timeFilter === 'monthly' ? 'This month' :
                 timeFilter === 'weekly' ? 'This week' : 'Last 24 hours'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Usage</CardTitle>
              <Repeat className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalUsage}</div>
              <p className="text-xs text-muted-foreground">
                {timeFilter === 'all-time' ? 'Times prompts used' : 
                 timeFilter === 'yearly' ? 'Usage this year' :
                 timeFilter === 'monthly' ? 'Usage this month' :
                 timeFilter === 'weekly' ? 'Usage this week' : 'Usage last 24h'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Daily Active Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.dailyActiveUsers}</div>
              <p className="text-xs text-muted-foreground">
                {timeFilter === 'all-time' ? 'Total active users' : 
                 timeFilter === 'yearly' ? 'Active this year' :
                 timeFilter === 'monthly' ? 'Active this month' :
                 timeFilter === 'weekly' ? 'Active this week' : 'Active last 24h'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Installs</CardTitle>
              <Download className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.numberOfInstalls}</div>
              <p className="text-xs text-muted-foreground">
                {timeFilter === 'all-time' ? 'Total downloads' : 
                 timeFilter === 'yearly' ? 'Downloads this year' :
                 timeFilter === 'monthly' ? 'Downloads this month' :
                 timeFilter === 'weekly' ? 'Downloads this week' : 'Downloads last 24h'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Recent Activity</CardTitle>
              <CardDescription>
                {timeFilter === 'all-time' ? 'Last 7 days' : 
                 timeFilter === 'yearly' ? 'This year' :
                 timeFilter === 'monthly' ? 'This month' :
                 timeFilter === 'weekly' ? 'This week' : 'Last 24 hours'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.recentActivity}</div>
              <p className="text-sm text-muted-foreground">New or updated prompts</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Prompt Reuse Rate</CardTitle>
              <CardDescription>
                {timeFilter === 'all-time' ? 'All time' : 
                 timeFilter === 'yearly' ? 'This year' :
                 timeFilter === 'monthly' ? 'This month' :
                 timeFilter === 'weekly' ? 'This week' : 'Last 24 hours'}
              </CardDescription>
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