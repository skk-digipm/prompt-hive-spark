import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wand2, Copy, Sparkles, ArrowRight } from 'lucide-react';
import { Prompt } from '@/types/prompt';
import { useToast } from '@/hooks/use-toast';

interface PromptRewriterProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt;
  onUsePrompt: (content: string) => void;
}

export const PromptRewriter = ({ isOpen, onClose, prompt, onUsePrompt }: PromptRewriterProps) => {
  const [rewrittenPrompt, setRewrittenPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<'original' | 'rewritten'>('original');
  const { toast } = useToast();

  const generateRewrite = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI rewrite - replace with actual AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const improvements = [
        "Be more specific and detailed in your request",
        "Add context about the desired outcome",
        "Include examples or constraints",
        "Specify the format of the response",
        "Add tone and style preferences"
      ];
      
      const randomImprovement = improvements[Math.floor(Math.random() * improvements.length)];
      
      setRewrittenPrompt(`${prompt.content}\n\n[AI Enhancement: ${randomImprovement}]\n\nPlease provide a detailed response that considers the specific context and requirements mentioned above.`);
      
      toast({
        title: "Prompt Enhanced",
        description: "AI has generated an improved version of your prompt.",
      });
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "Could not enhance the prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      onUsePrompt(content);
      toast({
        title: "Copied to clipboard",
        description: "Selected prompt has been copied to your clipboard.",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetAndClose = () => {
    setRewrittenPrompt('');
    setSelectedPrompt('original');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-text bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Prompt Enhancement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Enhanced Button */}
          <div className="flex justify-center">
            <Button
              onClick={generateRewrite}
              disabled={isGenerating}
              className="bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isGenerating ? 'Enhancing...' : 'Enhance with AI'}
            </Button>
          </div>

          {/* Side by side comparison - Always visible */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Prompt */}
            <div className="space-y-3 border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground text-lg">Original Prompt</h3>
                <div className="flex items-center gap-2">
                  {prompt.tone && (
                    <Badge variant="outline" className="text-xs">
                      {prompt.tone}
                    </Badge>
                  )}
                  {prompt.category && (
                    <Badge variant="secondary" className="text-xs">
                      {prompt.category}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="relative">
                <Textarea
                  value={prompt.content}
                  readOnly
                  className="min-h-[300px] resize-none bg-background"
                />
              </div>
              <Button
                onClick={() => copyToClipboard(prompt.content)}
                variant="outline"
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Use Original Prompt
              </Button>
            </div>

            {/* Enhanced Prompt */}
            <div className="space-y-3 border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground text-lg">Enhanced Prompt</h3>
                {rewrittenPrompt && (
                  <Badge variant="default" className="bg-gradient-primary text-primary-foreground">
                    AI Enhanced
                  </Badge>
                )}
              </div>
              <div className="relative">
                <Textarea
                  value={rewrittenPrompt || 'Click "Enhance with AI" above to generate an improved version of your prompt...'}
                  readOnly
                  className={`min-h-[300px] resize-none bg-background ${!rewrittenPrompt ? 'text-muted-foreground italic' : ''}`}
                />
                {isGenerating && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-md">
                    <div className="flex items-center gap-3 text-sm bg-card p-4 rounded-lg shadow-lg border">
                      <Wand2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="font-medium">AI is enhancing your prompt...</span>
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={() => copyToClipboard(rewrittenPrompt)}
                disabled={!rewrittenPrompt}
                variant="outline"
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Use Enhanced Prompt
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              onClick={resetAndClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};