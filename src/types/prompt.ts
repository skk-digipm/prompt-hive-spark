export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category?: string;
  tone?: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  isLongPrompt?: boolean; // For prompts > 2000 words
  sourceUrl?: string;
  aiModel?: string;
  rating?: number; // 1-5 stars
  versionNumber?: number;
  parentPromptId?: string;
  isCurrentVersion?: boolean;
  metadata?: {
    sourceUrl?: string;
    sourceDomain?: string;
    capturedAt?: Date;
    selectionContext?: string;
  };
}

export interface PromptFilter {
  search?: string;
  tags?: string[];
  category?: string;
  sortBy?: 'newest' | 'oldest' | 'usage' | 'alphabetical';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface PromptStats {
  totalPrompts: number;
  totalUsage: number;
  mostUsedTags: string[];
  recentActivity: number;
}