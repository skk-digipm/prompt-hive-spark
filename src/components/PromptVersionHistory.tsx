import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';
import { Textarea } from './ui/textarea';
import { Copy, Clock } from 'lucide-react';
import { Prompt } from '@/types/prompt';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PromptVersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt;
  onUseVersion: (prompt: Prompt) => void;
}

export const PromptVersionHistory = ({ isOpen, onClose, prompt, onUseVersion }: PromptVersionHistoryProps) => {
  const [versions, setVersions] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadVersionHistory();
    }
  }, [isOpen, prompt.id]);

  const loadVersionHistory = async () => {
    setLoading(true);
    try {
      // Load all versions including current
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .or(`id.eq.${prompt.id},parent_prompt_id.eq.${prompt.id}`)
        .order('version_number', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(item => ({
        ...item,
        id: item.id,
        title: item.title,
        content: item.content,
        tags: item.tags || [],
        category: item.category,
        tone: item.tone,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        usageCount: item.usage_count || 0,
        isLongPrompt: item.is_long_prompt,
        sourceUrl: item.source_url,
        aiModel: item.ai_model,
        rating: item.rating,
        metadata: item.metadata as any,
        versionNumber: item.version_number || 1,
        parentPromptId: item.parent_prompt_id,
        isCurrentVersion: item.is_current_version !== false
      })) || [];

      setVersions(formattedData);
    } catch (error) {
      console.error('Error loading version history:', error);
      toast({
        title: "Error",
        description: "Failed to load version history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const truncateContent = (content: string, limit: number = 100) => {
    if (content.length <= limit) return content;
    return content.slice(0, limit) + '...';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Version History - {prompt.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {loading ? (
            <div className="text-center py-8">Loading version history...</div>
          ) : versions.length <= 1 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No history available for this prompt yet</p>
              <p className="text-sm mt-2">History will be created when you edit and save this prompt</p>
            </div>
          ) : (
            versions.map((version, index) => (
              <Card key={version.id} className={`${version.isCurrentVersion ? 'border-primary' : 'border-border'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={version.isCurrentVersion ? "default" : "outline"}>
                        {version.isCurrentVersion ? 'Current' : `v${version.versionNumber}`}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(version.updatedAt)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onUseVersion(version)}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Use This Version
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-card-foreground">
                      {truncateContent(version.content)}
                    </div>
                    {version.content.length > 100 && (
                      <Dialog>
                        <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                          View full content
                        </Button>
                        <DialogContent className="max-w-2xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>Version {version.versionNumber} - {version.title}</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <Textarea
                              value={version.content}
                              readOnly
                              className="min-h-[300px] resize-none"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};