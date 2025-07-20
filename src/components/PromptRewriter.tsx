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
          {/* Original vs Rewritten Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setSelectedPrompt('original')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedPrompt === 'original'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Original Prompt
            </button>
            <button
              onClick={() => setSelectedPrompt('rewritten')}
              disabled={!rewrittenPrompt}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedPrompt === 'rewritten' && rewrittenPrompt
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground disabled:opacity-50'
              }`}
            >
              Enhanced Prompt
              {rewrittenPrompt && <Badge variant="secondary" className="ml-2 text-xs">New</Badge>}
            </button>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Prompt */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-card-foreground">Original Prompt</h3>
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
                  className={`min-h-[300px] resize-none ${
                    selectedPrompt === 'original' ? 'ring-2 ring-primary' : ''
                  }`}
                />
                {selectedPrompt === 'original' && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  </div>
                )}
              </div>
              <Button
                onClick={() => copyToClipboard(prompt.content)}
                variant="outline"
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Use Original
              </Button>
            </div>

            {/* Rewritten Prompt */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-card-foreground">Enhanced Prompt</h3>
                <Button
                  onClick={generateRewrite}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Enhancing...' : 'Enhance'}
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  value={rewrittenPrompt || 'Click "Enhance" to generate an improved version of your prompt...'}
                  readOnly
                  className={`min-h-[300px] resize-none ${
                    selectedPrompt === 'rewritten' && rewrittenPrompt ? 'ring-2 ring-primary' : ''
                  } ${!rewrittenPrompt ? 'text-muted-foreground' : ''}`}
                />
                {selectedPrompt === 'rewritten' && rewrittenPrompt && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  </div>
                )}
                {isGenerating && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-sm">
                      <Wand2 className="w-4 h-4 animate-spin" />
                      AI is enhancing your prompt...
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
                Use Enhanced
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={resetAndClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => copyToClipboard(selectedPrompt === 'original' ? prompt.content : rewrittenPrompt)}
              disabled={selectedPrompt === 'rewritten' && !rewrittenPrompt}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              <Copy className="w-4 h-4 mr-2" />
              Use Selected Prompt
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};