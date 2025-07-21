import { useState, useEffect } from 'react';
import { Prompt, PromptFilter } from '@/types/prompt';

// Mock data for development - will be replaced with Supabase integration
const mockPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Blog Post Introduction',
    content: 'Write an engaging introduction for a blog post about [TOPIC]. The introduction should hook the reader, provide context, and clearly state what they will learn.',
    tags: ['blog', 'writing', 'content'],
    category: 'Content Creation',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    usageCount: 12,
    rating: 5
  },
  {
    id: '2',
    title: 'Code Review Assistant',
    content: 'Review the following code and provide feedback on:\n1. Code quality and best practices\n2. Potential bugs or issues\n3. Performance optimizations\n4. Readability improvements\n\n[PASTE CODE HERE]',
    tags: ['code', 'review', 'development'],
    category: 'Development',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    usageCount: 8,
    rating: 4
  },
  {
    id: '3',
    title: 'Email Professional Response',
    content: 'Help me write a professional email response to [SITUATION]. The tone should be [TONE: formal/friendly/assertive] and include [KEY POINTS].',
    tags: ['email', 'professional', 'communication'],
    category: 'Business',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    usageCount: 15,
    rating: 5
  }
];

export const usePrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<PromptFilter>({});

  // Filter prompts based on current filter
  const filteredPrompts = prompts.filter(prompt => {
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      if (!prompt.title.toLowerCase().includes(searchLower) && 
          !prompt.content.toLowerCase().includes(searchLower) &&
          !prompt.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
        return false;
      }
    }
    
    if (filter.tags && filter.tags.length > 0) {
      if (!filter.tags.some(tag => prompt.tags.includes(tag))) {
        return false;
      }
    }
    
    if (filter.category && prompt.category !== filter.category) {
      return false;
    }
    
    return true;
  });

  const savePrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    setLoading(true);
    try {
      // Add URL tag automatically if metadata contains sourceUrl
      const tagsWithUrl = [...(promptData.tags || [])];
      if (promptData.metadata?.sourceUrl && !tagsWithUrl.includes('URL')) {
        tagsWithUrl.push('URL');
      }

      const newPrompt: Prompt = {
        ...promptData,
        tags: tagsWithUrl,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        isLongPrompt: promptData.content.length > 2000
      };
      
      setPrompts(prev => [newPrompt, ...prev]);
      return newPrompt;
    } catch (error) {
      console.error('Failed to save prompt:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
    setLoading(true);
    try {
      setPrompts(prev => prev.map(prompt => 
        prompt.id === id 
          ? { ...prompt, ...updates, updatedAt: new Date() }
          : prompt
      ));
    } catch (error) {
      console.error('Failed to update prompt:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = async (id: string) => {
    setLoading(true);
    try {
      setPrompts(prev => prev.filter(prompt => prompt.id !== id));
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const incrementUsage = async (id: string) => {
    setPrompts(prev => prev.map(prompt => 
      prompt.id === id 
        ? { ...prompt, usageCount: prompt.usageCount + 1, updatedAt: new Date() }
        : prompt
    ));
  };

  // Get all unique tags
  const allTags = [...new Set(prompts.flatMap(p => p.tags))];
  
  // Get all unique categories
  const allCategories = [...new Set(prompts.map(p => p.category).filter(Boolean))];

  return {
    prompts: filteredPrompts,
    allPrompts: prompts,
    loading,
    filter,
    setFilter,
    savePrompt,
    updatePrompt,
    deletePrompt,
    incrementUsage,
    allTags,
    allCategories
  };
};