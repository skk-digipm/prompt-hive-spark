import { useEffect, useState } from 'react';
import { ContextMenuCapture } from './ContextMenuCapture';
import { usePrompts } from '@/hooks/usePrompts';

export const TextSelectionHandler = () => {
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const { savePrompt } = usePrompts();

  useEffect(() => {
    console.log('TextSelectionHandler mounted');
    
    const handleTextSelection = () => {
      console.log('Text selection event triggered');
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      console.log('Selected text:', text, 'Length:', text?.length);

      if (text && text.length > 10) { // Minimum text length
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

    // Add event listeners for text selection
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);
    
    console.log('Event listeners added');

    return () => {
      console.log('TextSelectionHandler unmounting, removing event listeners');
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keyup', handleTextSelection);
    };
  }, []);

  const handleSavePrompt = async (promptData: any) => {
    await savePrompt(promptData);
    setShowMenu(false);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
    setSelectedText('');
  };

  if (!showMenu || !selectedText) return null;

  return (
    <ContextMenuCapture
      selectedText={selectedText}
      position={menuPosition}
      onClose={handleCloseMenu}
      onSave={handleSavePrompt}
    />
  );
};