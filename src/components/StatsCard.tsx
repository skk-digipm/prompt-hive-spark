import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Clock, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  totalPrompts: number;
  totalUsage: number;
  mostUsedTags: string[];
  recentActivity: number;
}

export const StatsCard = ({ totalPrompts, totalUsage, mostUsedTags, recentActivity }: StatsCardProps) => {
  const stats = [
    {
      title: 'Total Prompts',
      value: totalPrompts,
      icon: FileText,
      color: 'text-primary'
    },
    {
      title: 'Total Usage',
      value: totalUsage,
      icon: BarChart3,
      color: 'text-accent'
    },
    {
      title: 'Recent Activity',
      value: recentActivity,
      icon: TrendingUp,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-card-foreground">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Most Used Tags Card */}
      <Card className="bg-gradient-card border-border/50 shadow-card md:col-span-3">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Most Used Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {mostUsedTags.length > 0 ? (
              mostUsedTags.slice(0, 10).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No tags used yet</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};