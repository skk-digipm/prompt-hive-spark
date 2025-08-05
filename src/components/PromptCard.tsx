import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, Edit, Trash2, Star, BarChart3, Clock, Eye, Wand2, History } from 'lucide-react';
import { Prompt } from '@/types/prompt';
import { useToast } from '@/hooks/use-toast';
import { PromptRewriter } from './PromptRewriter';
import { PromptVersionHistory } from './PromptVersionHistory';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onUse: (id: string) => void;
  onUpdate?: (updatedPrompt: Prompt) => void;
}

export const PromptCard = ({ prompt, onEdit, onDelete, onUse, onUpdate }: PromptCardProps) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showRewriter, setShowRewriter] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Prompt content has been copied to your clipboard.",
      });
      onUse(prompt.id);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const truncateContent = (content: string, limit: number = 150) => {
    if (content.length <= limit) return content;
    return content.slice(0, limit) + '...';
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elevated transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-card-foreground truncate group-hover:text-primary transition-colors">
              {prompt.title}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Created {formatDate(prompt.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                {prompt.usageCount} uses
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded font-medium">
                  v{prompt.versionNumber || 1}
                </span>
              </div>
              {prompt.metadata?.lastEditedAt && (
                <div className="text-xs text-blue-600">
                  Last edited: {formatDate(new Date(prompt.metadata.lastEditedAt))}
                  {prompt.metadata?.editCount && ` (${prompt.metadata.editCount} edits)`}
                </div>
              )}
            </div>
            {prompt.metadata?.sourceUrl && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">Source URL:</div>
                <a 
                  href={prompt.metadata.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-primary/80 transition-colors underline break-all"
                  title={prompt.metadata.sourceUrl}
                >
                  {prompt.metadata.sourceDomain || new URL(prompt.metadata.sourceUrl).hostname}
                </a>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {renderStars(prompt.rating)}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVersionHistory(true)}
                className="h-8 w-8 p-0 hover:bg-accent"
              >
                <History className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(prompt)}
                className="h-8 w-8 p-0 hover:bg-accent"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(prompt.id)}
                className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mt-3">
          {prompt.category && (
            <Badge variant="secondary" className="w-fit">
              {prompt.category}
            </Badge>
          )}
          {prompt.tone && (
            <Badge variant="outline" className="w-fit">
              {prompt.tone}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <div className="space-y-3">
          <div className="text-sm text-card-foreground leading-relaxed">
            {truncateContent(prompt.content)}
            {prompt.content.length > 150 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="p-0 h-auto ml-1 text-primary">
                    <Eye className="w-3 h-3 mr-1" />
                    View full
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>{prompt.title}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <Textarea
                      value={prompt.content}
                      readOnly
                      className="min-h-[300px] resize-none"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {prompt.tags.slice(0, 3).map((tag, index) => {
                const colors = [
                  'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
                  'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
                  'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
                  'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
                  'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
                  'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700',
                  'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
                  'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
                  'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700',
                  'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700',
                  'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700',
                  'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
                  'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700',
                  'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
                  'bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/30 dark:text-lime-300 dark:border-lime-700',
                  'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700'
                ];
                const colorClass = colors[index % colors.length];
                return (
                  <Badge key={tag} className={`text-xs border ${colorClass}`}>
                    {tag}
                  </Badge>
                );
              })}
              {prompt.tags.length > 3 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{prompt.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <div className="flex gap-2 w-full">
          <Button
            onClick={() => copyToClipboard(prompt.content)}
            className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
            size="sm"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy & Use
          </Button>
          <Button
            onClick={() => setShowRewriter(true)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Enhance with AI
          </Button>
        </div>
      </CardFooter>

      <PromptRewriter
        isOpen={showRewriter}
        onClose={() => setShowRewriter(false)}
        prompt={prompt}
        onUsePrompt={(content) => {
          copyToClipboard(content);
          setShowRewriter(false);
        }}
      />

      <PromptVersionHistory
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        prompt={prompt}
        onUseVersion={(versionPrompt) => {
          copyToClipboard(versionPrompt.content);
          setShowVersionHistory(false);
        }}
      />
    </Card>
  );
};