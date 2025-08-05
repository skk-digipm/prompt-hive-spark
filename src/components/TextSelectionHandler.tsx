import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePrompts } from '@/hooks/usePrompts';
import { supabase } from '@/integrations/supabase/client';

export const TextSelectionHandler = () => {
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { savePrompt, loadPrompts } = usePrompts();
  const { toast } = useToast();

  useEffect(() => {
    const clearSelection = () => {
      setShowMenu(false);
      setSelectedText('');
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';
      
      // Immediately hide if no selection
      if (!text || text.length <= 10) {
        clearSelection();
        return;
      }
    };

    const handleTextSelection = () => {
      // Small delay to ensure selection is complete
      setTimeout(() => {
        const selection = window.getSelection();
        
        if (!selection || selection.rangeCount === 0) {
          clearSelection();
          return;
        }

        const text = selection.toString().trim();
        
        if (!text || text.length <= 10) {
          clearSelection();
          return;
        }

        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          // Position button relative to viewport, not document
          const buttonX = Math.min(rect.right + 10, window.innerWidth - 200);
          const buttonY = Math.max(rect.bottom + 5, 10);
          
          setSelectedText(text);
          setMenuPosition({ x: buttonX, y: buttonY });
          setShowMenu(true);
        } catch (error) {
          console.error('Error positioning button:', error);
          clearSelection();
        }
      }, 10);
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.floating-save-button')) {
        // Check if there's still a valid selection
        const selection = window.getSelection();
        if (!selection?.toString().trim()) {
          clearSelection();
        }
      }
    };

    // Use both mouseup and selectionchange for comprehensive coverage
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSavePrompt = async () => {
    console.log('Save prompt clicked');
    setIsAnalyzing(true);
    
    const url = window.location.href;
    const domain = window.location.hostname;
    
    try {
      // Use AI to analyze the prompt and generate metadata
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-prompt', {
        body: {
          content: selectedText,
          sourceUrl: url,
          sourceDomain: domain
        }
      });

      let title, category, tags;

      if (analysisError || !analysisData) {
        console.warn('AI analysis failed, using fallback:', analysisError);
        // Fallback to manual logic
        title = selectedText.length > 50 
          ? selectedText.substring(0, 50) + '...'
          : selectedText;
        
        category = 'General';
        if (domain.includes('chatgpt') || domain.includes('openai')) {
          category = 'ChatGPT';
        } else if (domain.includes('claude') || domain.includes('anthropic')) {
          category = 'Claude';
        }
        
        tags = [domain.split('.')[0]];
      } else {
        // Use AI-generated metadata
        title = analysisData.title;
        category = analysisData.category;
        tags = analysisData.tags;
      }

      const promptData = {
        title,
        content: selectedText,
        category,
        tags,
        metadata: {
          sourceUrl: url,
          sourceDomain: domain,
          capturedAt: new Date(),
          selectionContext: document.title
        }
      };

      await savePrompt(promptData);
      await loadPrompts(); // Refresh the prompt list
      
      toast({
        title: "Prompt saved!",
        description: `"${title}" saved to PromptHive`,
      });
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast({
        title: "Error",
        description: "Failed to save prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setShowMenu(false);
      setSelectedText('');
    }
  };

  return (
    <>
      {showMenu && selectedText && (
        <div 
          style={{
            position: 'fixed',
            left: `${Math.min(menuPosition.x, window.innerWidth - 200)}px`,
            top: `${Math.max(menuPosition.y, 10)}px`,
            zIndex: 9999,
            pointerEvents: 'auto'
          }}
        >
          <Button
            onClick={handleSavePrompt}
            disabled={isAnalyzing}
            className="bg-gradient-primary hover:opacity-90 text-sm shadow-2xl border border-primary/20 animate-in fade-in-0 zoom-in-95 backdrop-blur-sm floating-save-button"
            size="sm"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Save to PromptHive'}
          </Button>
        </div>
      )}
    </>
  );
};