import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface GuestSignupPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignupClick: () => void;
}

export const GuestSignupPrompt = ({ open, onOpenChange, onSignupClick }: GuestSignupPromptProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>🎉 Hope you're enjoying PromptHive!</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            We noticed you just saved your first prompt. Would you like to create an account 
            so you can review, reuse, and add more prompts for future use?
          </p>
          
          <p className="text-sm text-muted-foreground">
            With an account, you'll be able to:
          </p>
          
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Save unlimited prompts</li>
            <li>• Access your prompts from any device</li>
            <li>• Organize with tags and categories</li>
            <li>• Export your prompt library</li>
          </ul>
          
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={() => {
                onOpenChange(false);
                onSignupClick();
              }}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              Yes, Sign Me Up!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};