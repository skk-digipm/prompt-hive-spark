import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, FileText, User, Plus, Sparkles, Settings, LogOut, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePrompts } from '@/hooks/usePrompts';
import { PromptCard } from '@/components/PromptCard';
import { PromptForm } from '@/components/PromptForm';
import { SearchBar } from '@/components/SearchBar';
import { FilterDropdown } from '@/components/FilterDropdown';
import { StatsCard } from '@/components/StatsCard';
import { TextSelectionHandler } from '@/components/TextSelectionHandler';
import { AuthDialog } from '@/components/AuthDialog';
import { UserProfile } from '@/components/UserProfile';
import { GuestSignupPrompt } from '@/components/GuestSignupPrompt';
import { LoginPopup } from '@/components/LoginPopup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { exportToCSV, exportToJSON } from '@/utils/export';
import { Prompt } from '@/types/prompt';

const Index = () => {
  const { prompts, loading, filter, setFilter, savePrompt, updatePrompt, deletePrompt, incrementUsage, allTags, allCategories } = usePrompts();
  const { user, signOut, signInAnonymously } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [guestPromptCount, setGuestPromptCount] = useState(0);

  const handleSavePrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    if (editingPrompt) {
      // Update existing prompt
      await updatePrompt(editingPrompt.id, promptData);
    } else {
      // Create new prompt
      await savePrompt(promptData);
      
      // Check if user is guest and this is their first prompt
      if (!user && guestPromptCount === 0) {
        setGuestPromptCount(1);
        setTimeout(() => {
          setShowGuestPrompt(true);
        }, 1000);
      }
    }
    
    setShowForm(false);
    setEditingPrompt(null);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setShowForm(true);
  };

  const handleDeletePrompt = async (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      await deletePrompt(id);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(prompts);
  };

  const handleExportJSON = () => {
    exportToJSON(prompts);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPrompt(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading your prompts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border/50 shadow-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate('/prompts')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl bg-gradient-text bg-clip-text text-transparent">
                PromptHive
              </span>
            </button>
            
            <TooltipProvider>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/dashboard">
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dashboard</p>
                  </TooltipContent>
                </Tooltip>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export</p>
                      </TooltipContent>
                    </Tooltip>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border border-border shadow-elevated z-50">
                    <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
                      <FileText className="w-4 h-4 mr-2" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportJSON} className="cursor-pointer">
                      <FileText className="w-4 h-4 mr-2" />
                      Export as JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="w-4 h-4 mr-2" />
                        {user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-elevated z-50">
                      <DropdownMenuItem 
                        onClick={() => setShowProfile(true)}
                        className="cursor-pointer"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={async () => {
                          await signOut();
                          navigate('/');
                        }}
                        className="cursor-pointer text-destructive"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowLoginPopup(true)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login / Sign Up
                  </Button>
                )}
              
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setShowForm(true)}
                      className="bg-gradient-primary hover:opacity-90"
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Prompt</p>
                  </TooltipContent>
                </Tooltip>
              </div>
             </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar
            filter={filter}
            onFilterChange={setFilter}
            allTags={allTags}
            allCategories={allCategories}
          />
          <div className="flex items-center justify-between">
            <div></div>
            <FilterDropdown
              filter={filter}
              onFilterChange={setFilter}
              allTags={allTags}
              allCategories={allCategories}
            />
          </div>
        </div>

        {/* Context Menu Wrapper */}
        <ContextMenu>
          <ContextMenuTrigger className="flex-1">
            {/* Prompts Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {prompts.length > 0 ? `${prompts.length} Prompt${prompts.length === 1 ? '' : 's'}` : 'No prompts found'}
                </h2>
              </div>

              {prompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prompts.map((prompt) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      onEdit={handleEditPrompt}
                      onDelete={handleDeletePrompt}
                      onUse={incrementUsage}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No prompts yet</h3>
                  <p className="text-muted-foreground mb-4">Get started by adding your first AI prompt!</p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Prompt
                  </Button>
                </div>
              )}
            </div>
          </ContextMenuTrigger>
          
          <ContextMenuContent className="w-48 bg-background border border-border shadow-elevated z-50">
            <ContextMenuItem onClick={() => setShowForm(true)} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Add New Prompt
            </ContextMenuItem>
            {!user && (
              <>
                <ContextMenuItem 
                  onClick={() => setShowLoginPopup(true)}
                >
                  Login / Sign Up
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={async () => {
                    const { error } = await signInAnonymously();
                    if (error) {
                      console.error('Guest login failed:', error);
                    }
                  }}
                >
                  Continue as Guest
                </ContextMenuItem>
              </>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </main>

      {/* Prompt Form Modal */}
      <PromptForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSave={handleSavePrompt}
        editPrompt={editingPrompt}
        categories={allCategories}
      />

      <AuthDialog 
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
      
      <UserProfile 
        open={showProfile}
        onOpenChange={setShowProfile}
      />
      
      <GuestSignupPrompt 
        open={showGuestPrompt}
        onOpenChange={setShowGuestPrompt}
        onSignupClick={() => setShowLoginPopup(true)}
      />
      
      <LoginPopup 
        open={showLoginPopup}
        onOpenChange={setShowLoginPopup}
      />
      
      <TextSelectionHandler />
    </div>
  );
};

export default Index;