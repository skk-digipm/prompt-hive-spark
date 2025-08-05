import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { UserPlus, X } from 'lucide-react';
import { useState } from 'react';

interface GuestBannerProps {
  onSignupClick: () => void;
  promptCount: number;
}

export const GuestBanner = ({ onSignupClick, promptCount }: GuestBannerProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || promptCount === 0) return null;

  return (
    <Alert className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <UserPlus className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <span className="font-medium">You're in Guest Mode</span>
          <span className="text-muted-foreground ml-2">
            Sign up to save your {promptCount} prompt{promptCount > 1 ? 's' : ''} permanently and access them anywhere!
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button 
            size="sm" 
            onClick={onSignupClick}
            className="bg-gradient-primary hover:opacity-90"
          >
            Sign Up Now
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};