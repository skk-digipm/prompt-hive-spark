import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Wand2, Save } from 'lucide-react';
import { Prompt } from '@/types/prompt';
import { useToast } from '@/hooks/use-toast';

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Promise<void>;
  editPrompt?: Prompt | null;
  categories: string[];
}

export const PromptForm = ({ isOpen, onClose, onSave, editPrompt, categories }: PromptFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Populate form when editing a prompt
  useEffect(() => {
    if (editPrompt) {
      setTitle(editPrompt.title || '');
      setContent(editPrompt.content || '');
      setCategory(editPrompt.category || '');
      setTags(editPrompt.tags || []);
      setSourceUrl(editPrompt.sourceUrl || editPrompt.metadata?.sourceUrl || '');
      setRating(editPrompt.rating || undefined);
    } else {
      resetForm();
    }
  }, [editPrompt, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        category: category.trim() || undefined,
        tags,
        sourceUrl: sourceUrl.trim() || undefined,
        rating
      });
      
      resetForm();
      onClose();
      toast({
        title: editPrompt ? "Prompt updated" : "Prompt saved",
        description: `Your prompt has been ${editPrompt ? 'updated' : 'saved'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editPrompt ? 'update' : 'save'} prompt. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setTags([]);
    setNewTag('');
    setSourceUrl('');
    setRating(undefined);
  };

  const addTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const [enhancing, setEnhancing] = useState(false);

  const enhanceWithAI = async () => {
    if (!content.trim()) {
      toast({
        title: "No content to enhance",
        description: "Please enter some prompt content first.",
        variant: "destructive",
      });
      return;
    }

    setEnhancing(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhance-prompt', {
        body: { prompt: content }
      });

      if (error) {
        throw error;
      }

      if (data?.enhancedPrompt) {
        setContent(data.enhancedPrompt);
        toast({
          title: "Prompt enhanced!",
          description: "Your prompt has been improved with AI suggestions.",
        });
      } else {
        throw new Error('No enhanced prompt received');
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      toast({
        title: "Enhancement failed",
        description: "Could not enhance the prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEnhancing(false);
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isLongPrompt = content.length > 2000;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-text bg-clip-text text-transparent">
            {editPrompt ? 'Edit Prompt' : 'Add New Prompt'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your prompt a descriptive title..."
              className="border-border/50 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Prompt Content *</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{wordCount} words</span>
                {isLongPrompt && (
                  <Badge variant="secondary" className="text-xs">
                    Long Prompt
                  </Badge>
                )}
              </div>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your prompt content here..."
              className="min-h-[200px] border-border/50 focus:ring-primary resize-y"
            />
            {isLongPrompt && (
              <p className="text-xs text-muted-foreground">
                Long prompts (2000+ characters) will be optimized for database storage.
              </p>
            )}
          </div>


          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="border-border/50"
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceUrl">Source URL (optional)</Label>
            <Input
              id="sourceUrl"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="Where did you find this prompt?"
              className="border-border/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={enhanceWithAI}
              disabled={enhancing || !content.trim()}
              className="flex-1"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {enhancing ? 'Enhancing...' : 'Enhance with AI'}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : editPrompt ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};