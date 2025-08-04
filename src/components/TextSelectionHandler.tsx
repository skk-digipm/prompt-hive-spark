import { useEffect, useState } from 'react';
import { ContextMenuCapture } from './ContextMenuCapture';
import { usePrompts } from '@/hooks/usePrompts';

export const TextSelectionHandler = () => {
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const { savePrompt } = usePrompts();

  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 10) { // Minimum text length
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setSelectedText(text);
        setMenuPosition({ 
          x: rect.right + 10, 
          y: rect.top + window.scrollY - 10 
        });
        setShowMenu(true);
      } else {
        setShowMenu(false);
        setSelectedText('');
      }
    };

    // Add event listeners for text selection
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);

    return () => {
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