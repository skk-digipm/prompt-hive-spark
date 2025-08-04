import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePrompts } from '@/hooks/usePrompts';

export const TextSelectionHandler = () => {
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const { savePrompt, loadPrompts } = usePrompts();
  const { toast } = useToast();

  console.log('TextSelectionHandler rendering, showMenu:', showMenu, 'selectedText:', selectedText);

  useEffect(() => {
    console.log('TextSelectionHandler mounted');
    
    const handleTextSelection = (e: MouseEvent) => {
      console.log('Mouse up event triggered');
      
      // Capture selection immediately - no delay
      const selection = window.getSelection();
      console.log('Selection object:', selection);
      
      if (!selection) {
        console.log('No selection object found');
        setShowMenu(false);
        setSelectedText('');
        return;
      }

      // Multiple ways to get selected text
      let text = '';
      try {
        // Method 1: Direct toString
        text = selection.toString().trim();
        console.log('Method 1 - toString():', `"${text}"`, 'Length:', text.length);
        
        // Method 2: Range-based (fallback)
        if (!text && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          text = range.toString().trim();
          console.log('Method 2 - range.toString():', `"${text}"`, 'Length:', text.length);
        }
        
        // Method 3: Text content (fallback)
        if (!text && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const contents = range.cloneContents();
          text = contents.textContent?.trim() || '';
          console.log('Method 3 - textContent:', `"${text}"`, 'Length:', text.length);
        }
      } catch (error) {
        console.error('Error getting selected text:', error);
      }

      if (text && text.length > 10) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          // Calculate better position
          const buttonX = Math.min(rect.right + 10, window.innerWidth - 200);
          const buttonY = Math.max(rect.top + window.scrollY - 10, 10);
          
          console.log('Showing menu at position:', { x: buttonX, y: buttonY });
          console.log('Final selected text:', `"${text}"`);
          
          setSelectedText(text);
          setMenuPosition({ x: buttonX, y: buttonY });
          setShowMenu(true);
        } catch (error) {
          console.error('Error getting selection range:', error);
          setShowMenu(false);
          setSelectedText('');
        }
      } else {
        console.log('Text too short or empty, hiding menu. Length:', text.length);
        setShowMenu(false);
        setSelectedText('');
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      // Check if click is outside the floating button
      const target = e.target as Element;
      if (!target.closest('.floating-save-button')) {
        const selection = window.getSelection();
        if (!selection?.toString().trim()) {
          console.log('Clearing selection due to outside click');
          setShowMenu(false);
          setSelectedText('');
        }
      }
    };

    // Only use mouseup event for better reliability
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('click', handleClickOutside);
    
    console.log('Event listeners added');

    return () => {
      console.log('TextSelectionHandler unmounting');
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('click', handleClickOutside);
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
    }

    setShowMenu(false);
    setSelectedText('');
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
            className="bg-gradient-primary hover:opacity-90 text-sm shadow-2xl border border-primary/20 animate-in fade-in-0 zoom-in-95 backdrop-blur-sm floating-save-button"
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