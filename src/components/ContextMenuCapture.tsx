import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContextMenuCaptureProps {
  selectedText: string;
  position: { x: number; y: number };
  onClose: () => void;
  onSave: (promptData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    metadata: {
      sourceUrl: string;
      sourceDomain: string;
      capturedAt: Date;
      selectionContext?: string;
    };
  }) => void;
}

export const ContextMenuCapture = ({ 
  selectedText, 
  position, 
  onClose, 
  onSave 
}: ContextMenuCaptureProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.context-menu-capture')) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleSavePrompt = () => {
    const url = window.location.href;
    const domain = window.location.hostname;
    
    // Generate a title from the first 50 characters
    const title = selectedText.length > 50 
      ? selectedText.substring(0, 50) + '...'
      : selectedText;

    // Auto-categorize based on domain
    let category = 'General';
    if (domain.includes('chatgpt') || domain.includes('openai')) {
      category = 'ChatGPT';
    } else if (domain.includes('claude') || domain.includes('anthropic')) {
      category = 'Claude';
    } else if (domain.includes('reddit')) {
      category = 'Community';
    } else if (domain.includes('quora')) {
      category = 'Q&A';
    }

    const promptData = {
      title,
      content: selectedText,
      category,
      tags: [domain.split('.')[0]], // Add domain as tag
      metadata: {
        sourceUrl: url,
        sourceDomain: domain,
        capturedAt: new Date(),
        selectionContext: document.title
      }
    };

    onSave(promptData);
    
    toast({
      title: "Prompt saved!",
      description: `Captured from ${domain}`,
    });

    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="context-menu-capture fixed z-[9999] pointer-events-none"
      style={{
        left: `${Math.min(position.x, window.innerWidth - 320)}px`,
        top: `${Math.min(position.y, window.innerHeight - 200)}px`,
      }}
    >
      <Card className="w-80 shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-sm pointer-events-auto animate-in fade-in-0 zoom-in-95">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">
                PromptHive Assistant
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-1">Selected text:</div>
            <div className="text-xs bg-muted/50 p-2 rounded border max-h-20 overflow-y-auto">
              {selectedText.length > 150 
                ? selectedText.substring(0, 150) + '...'
                : selectedText
              }
            </div>
          </div>

          <Button
            onClick={handleSavePrompt}
            className="w-full bg-gradient-primary hover:opacity-90 text-sm"
            size="sm"
          >
            Save to PromptHive
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};