import { useEffect, useState } from 'react';
import { ContextMenuCapture } from './ContextMenuCapture';
import { usePrompts } from '@/hooks/usePrompts';

export const TextSelectionHandler = () => {
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const { savePrompt } = usePrompts();

  useEffect(() => {
    const handleTextSelection = (event: MouseEvent) => {
      // Only show on right-click
      if (event.button !== 2) return;

      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 10) { // Minimum text length
        event.preventDefault();
        event.stopPropagation();
        
        setSelectedText(text);
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setShowMenu(true);
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 10) {
        event.preventDefault(); // Prevent default context menu
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleTextSelection);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('mousedown', handleTextSelection);
      document.removeEventListener('contextmenu', handleContextMenu);
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