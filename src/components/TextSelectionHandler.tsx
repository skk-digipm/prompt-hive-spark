import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePrompts } from '@/hooks/usePrompts';

export const TextSelectionHandler = () => {
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const { savePrompt } = usePrompts();
  const { toast } = useToast();

  console.log('TextSelectionHandler rendering, showMenu:', showMenu, 'selectedText:', selectedText);

  useEffect(() => {
    console.log('TextSelectionHandler mounted');
    
    const handleTextSelection = () => {
      console.log('Text selection event triggered');
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      console.log('Selected text:', text, 'Length:', text?.length);

      if (text && text.length > 10) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        console.log('Showing menu at position:', { x: rect.right + 10, y: rect.top + window.scrollY - 10 });
        
        setSelectedText(text);
        setMenuPosition({ 
          x: rect.right + 10, 
          y: rect.top + window.scrollY - 10 
        });
        setShowMenu(true);
      } else {
        console.log('Text too short or no text selected, hiding menu');
        setShowMenu(false);
        setSelectedText('');
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);
    
    console.log('Event listeners added');

    return () => {
      console.log('TextSelectionHandler unmounting');
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keyup', handleTextSelection);
    };
  }, []);

  const handleSavePrompt = async () => {
    console.log('Save prompt clicked');
    
    const url = window.location.href;
    const domain = window.location.hostname;
    
    const title = selectedText.length > 50 
      ? selectedText.substring(0, 50) + '...'
      : selectedText;

    let category = 'General';
    if (domain.includes('chatgpt') || domain.includes('openai')) {
      category = 'ChatGPT';
    } else if (domain.includes('claude') || domain.includes('anthropic')) {
      category = 'Claude';
    }

    const promptData = {
      title,
      content: selectedText,
      category,
      tags: [domain.split('.')[0]],
      metadata: {
        sourceUrl: url,
        sourceDomain: domain,
        capturedAt: new Date(),
        selectionContext: document.title
      }
    };

    try {
      console.log('Saving prompt with data:', promptData);
      await savePrompt(promptData);
      
      toast({
        title: "Prompt saved!",
        description: `"${title}" saved to PromptHive`,
      });
      
      console.log('Prompt saved successfully');
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast({
        title: "Error",
        description: "Failed to save prompt. Please try again.",
        variant: "destructive"
      });
    }

    setShowMenu(false);
    setSelectedText('');
  };

  // Always render the button for testing
  return (
    <>
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, background: 'red', color: 'white', padding: '5px' }}>
        Debug: showMenu={showMenu.toString()}, text length={selectedText.length}
      </div>
      
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
            className="bg-gradient-primary hover:opacity-90 text-sm shadow-2xl border border-primary/20 animate-in fade-in-0 zoom-in-95 backdrop-blur-sm"
            size="sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Save to PromptHive
          </Button>
        </div>
      )}
    </>
  );
};