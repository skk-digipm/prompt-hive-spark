import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePrompts } from '@/hooks/usePrompts';

export const useExtensionPrompts = () => {
  const { toast } = useToast();
  const { savePrompt, loadPrompts } = usePrompts();
  const [pendingPrompt, setPendingPrompt] = useState<any>(null);

  useEffect(() => {
    // Check for pending prompts from content script
    const checkPendingPrompt = async () => {
      if (typeof window !== 'undefined' && (window as any).chrome?.runtime) {
        try {
          (window as any).chrome.runtime.sendMessage(
            { type: 'GET_PENDING_PROMPT' },
            (response: any) => {
              if (response) {
                setPendingPrompt(response);
              }
            }
          );
        } catch (error) {
          console.log('Not in extension context');
        }
      }
    };

    checkPendingPrompt();
  }, []);

  useEffect(() => {
    if (pendingPrompt) {
      handleSavePendingPrompt();
    }
  }, [pendingPrompt]);

  const handleSavePendingPrompt = async () => {
    if (!pendingPrompt) return;

    try {
      await savePrompt(pendingPrompt);
      await loadPrompts();
      
      toast({
        title: "Prompt saved!",
        description: `Captured from ${pendingPrompt.metadata?.sourceDomain || 'webpage'}`,
      });

      setPendingPrompt(null);
    } catch (error) {
      console.error('Failed to save pending prompt:', error);
      toast({
        title: "Error",
        description: "Failed to save prompt",
        variant: "destructive",
      });
    }
  };

  return {
    pendingPrompt,
    handleSavePendingPrompt
  };
};