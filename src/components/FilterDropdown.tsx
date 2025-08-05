import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X, Tag, Calendar, TrendingUp } from 'lucide-react';
import { PromptFilter } from '@/types/prompt';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { format } from 'date-fns';

interface FilterDropdownProps {
  filter: PromptFilter;
  onFilterChange: (filter: PromptFilter) => void;
  allTags: string[];
}

export const FilterDropdown = ({ filter, onFilterChange, allTags }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

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


  const handleSortChange = (sort: string) => {
    onFilterChange({ 
      ...filter, 
      sortBy: sort === 'default' ? undefined : sort as any
    });
  };

  const handleDatePresetChange = (preset: string) => {
    const now = new Date();
    let start: Date, end: Date = now;

    switch (preset) {
      case 'weekly':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'quarterly':
        start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case 'half-yearly':
        start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case 'annually':
        start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        return;
    }

    onFilterChange({
      ...filter,
      dateRange: { start, end }
    });
  };

  const handleCustomDateChange = (dateRange: { start: Date; end: Date } | undefined) => {
    onFilterChange({
      ...filter,
      dateRange
    });
  };

  const clearFilters = () => {
    onFilterChange({});
    setIsOpen(false);
  };

  const hasActiveFilters = filter.tags?.length || filter.sortBy || filter.dateRange;
  const filterCount = (filter.tags?.length || 0) + (filter.sortBy ? 1 : 0) + (filter.dateRange ? 1 : 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {filterCount > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {filterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Filter Options</h4>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-auto p-1"
              >
                Clear All
              </Button>
            )}
          </div>


          {/* Sort Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              Sort By
            </label>
            <Select value={filter.sortBy || 'default'} onValueChange={handleSortChange}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="usage">Most Used</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Date Range
            </label>
            <Select onValueChange={handleDatePresetChange}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Last Week</SelectItem>
                <SelectItem value="monthly">Last Month</SelectItem>
                <SelectItem value="quarterly">Last Quarter</SelectItem>
                <SelectItem value="half-yearly">Last 6 Months</SelectItem>
                <SelectItem value="annually">Last Year</SelectItem>
              </SelectContent>
            </Select>
            {filter.dateRange && (
              <div className="text-xs text-muted-foreground">
                {format(filter.dateRange.start, 'MMM dd')} - {format(filter.dateRange.end, 'MMM dd, yyyy')}
              </div>
            )}
          </div>

          {/* Tags Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {allTags.map((tag) => {
                const isSelected = filter.tags?.includes(tag);
                return (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={isSelected}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <label
                      htmlFor={tag}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {tag}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};