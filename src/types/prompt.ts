export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  isLongPrompt?: boolean; // For prompts > 2000 words
  sourceUrl?: string;
  aiModel?: string;
  rating?: number; // 1-5 stars
}

export interface PromptFilter {
  search?: string;
  tags?: string[];
  category?: string;
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