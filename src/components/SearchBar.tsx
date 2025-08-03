import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, X, Tag } from 'lucide-react';
import { PromptFilter } from '@/types/prompt';

interface SearchBarProps {
  filter: PromptFilter;
  onFilterChange: (filter: PromptFilter) => void;
  allTags: string[];
  allCategories: string[];
}

export const SearchBar = ({ filter, onFilterChange, allTags, allCategories }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState(filter.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filter, search: searchInput.trim() || undefined });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filter.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFilterChange({ 
      ...filter, 
      tags: newTags.length > 0 ? newTags : undefined 
    });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ 
      ...filter, 
      category: category === 'all' ? undefined : category 
    });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFilterChange({});
  };

  const hasActiveFilters = filter.search || filter.tags?.length || filter.category;

  return (
    <div className="space-y-4">
      {/* Search Input and Filters in one row */}
      <div className="flex items-center gap-4 flex-wrap">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search prompts by title, content, or tags..."
            className="pl-10 pr-4 border-border/50 focus:ring-primary"
          />
        </form>

        {/* Category Filter */}
        <Select value={filter.category || 'all'} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-48 border-border/50">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tag Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-border/50">
              <Tag className="w-4 h-4 mr-2" />
              Tags
              {filter.tags?.length ? (
                <Badge variant="secondary" className="ml-2">
                  {filter.tags.length}
                </Badge>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Filter by Tags</h4>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {allTags.map((tag) => {
                  const isSelected = filter.tags?.includes(tag);
                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>


      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filter.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filter.search}
              <X
                className="w-3 h-3 cursor-pointer hover:text-destructive"
                onClick={() => {
                  setSearchInput('');
                  onFilterChange({ ...filter, search: undefined });
                }}
              />
            </Badge>
          )}
          
          {filter.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filter.category}
              <X
                className="w-3 h-3 cursor-pointer hover:text-destructive"
                onClick={() => onFilterChange({ ...filter, category: undefined })}
              />
            </Badge>
          )}
          
          {filter.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X
                className="w-3 h-3 cursor-pointer hover:text-destructive"
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};