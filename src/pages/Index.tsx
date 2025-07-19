import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Sparkles } from 'lucide-react';
import { usePrompts } from '@/hooks/usePrompts';
import { PromptCard } from '@/components/PromptCard';
import { PromptForm } from '@/components/PromptForm';
import { SearchBar } from '@/components/SearchBar';
import { StatsCard } from '@/components/StatsCard';
import { exportToCSV, exportToJSON } from '@/utils/export';
import { Prompt } from '@/types/prompt';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const {
    prompts,
    allPrompts,
    loading,
    filter,
    setFilter,
    savePrompt,
    updatePrompt,
    deletePrompt,
    incrementUsage,
    allTags,
    allCategories
  } = usePrompts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const { toast } = useToast();

  const handleSavePrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    if (editingPrompt) {
      await updatePrompt(editingPrompt.id, promptData);
    } else {
      await savePrompt(promptData);
    }
    setEditingPrompt(null);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  const handleDeletePrompt = async (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      await deletePrompt(id);
      toast({
        title: "Prompt deleted",
        description: "The prompt has been successfully deleted.",
      });
    }
  };

  const handleExportCSV = () => {
    exportToCSV(allPrompts);
    toast({
      title: "Export complete",
      description: "Your prompts have been exported to CSV.",
    });
  };

  const handleExportJSON = () => {
    exportToJSON(allPrompts);
    toast({
      title: "Export complete", 
      description: "Your prompts have been exported to JSON.",
    });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPrompt(null);
  };

  // Calculate stats
  const stats = {
    totalPrompts: allPrompts.length,
    totalUsage: allPrompts.reduce((sum, p) => sum + p.usageCount, 0),
    mostUsedTags: allTags.slice(0, 5),
    recentActivity: allPrompts.filter(p => {
      const daysDiff = (new Date().getTime() - p.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border/50 shadow-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-text bg-clip-text text-transparent">
                  PromptHive
                </h1>
                <p className="text-xs text-muted-foreground">AI Prompt Manager</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="hidden sm:flex"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJSON}
                className="hidden sm:flex"
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-primary hover:opacity-90"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Prompt
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <StatsCard {...stats} />

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar
            filter={filter}
            onFilterChange={setFilter}
            allTags={allTags}
            allCategories={allCategories}
          />
        </div>

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
              <h3 className="text-lg font-medium text-foreground mb-2">
                {allPrompts.length === 0 ? 'No prompts yet' : 'No matching prompts'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {allPrompts.length === 0 
                  ? 'Get started by adding your first AI prompt!'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Prompt
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Prompt Form Modal */}
      <PromptForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleSavePrompt}
        editPrompt={editingPrompt}
        categories={allCategories}
      />
    </div>
  );
};

export default Index;
