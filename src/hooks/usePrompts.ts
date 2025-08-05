import { useState, useEffect } from 'react';
import { Prompt, PromptFilter } from '@/types/prompt';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const usePrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<PromptFilter>({});
  const [allTags, setAllTags] = useState<string[]>([]);
  const { user } = useAuth();

  // Load prompts from Supabase
  const loadPrompts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPrompts: Prompt[] = data.map(prompt => ({
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        tags: prompt.tags || [],
        category: prompt.category,
        tone: prompt.tone,
        createdAt: new Date(prompt.created_at),
        updatedAt: new Date(prompt.updated_at),
        usageCount: prompt.usage_count,
        rating: prompt.rating,
        sourceUrl: prompt.source_url,
        aiModel: prompt.ai_model,
        isLongPrompt: prompt.is_long_prompt,
        versionNumber: prompt.version_number || 1,
        parentPromptId: prompt.parent_prompt_id,
        isCurrentVersion: prompt.is_current_version !== false,
        metadata: prompt.metadata as any
      }));

      setPrompts(formattedPrompts);
    } catch (error) {
      console.error('Failed to load prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load available tags
  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('name')
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setAllTags(data.map(tag => tag.name));
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  useEffect(() => {
    loadPrompts();
    loadTags();
  }, []);

  // Filter prompts based on current filter
  const filteredPrompts = prompts.filter(prompt => {
    // Only show current versions in the main list
    if (!prompt.isCurrentVersion) return false;
    
    // If user is signed out, don't show any prompts
    if (!user) return false;

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

      const { data, error } = await supabase
        .from('prompts')
        .insert({
          user_id: user?.id || null,
          title: promptData.title,
          content: promptData.content,
          tags: tagsWithUrl,
          category: promptData.category,
          tone: promptData.tone,
          source_url: promptData.sourceUrl,
          ai_model: promptData.aiModel,
          rating: promptData.rating,
          is_long_prompt: promptData.content.length > 2000,
          metadata: promptData.metadata as any
        })
        .select()
        .single();

      if (error) throw error;

      // Update tags in database
      if (tagsWithUrl.length > 0) {
        await supabase.rpc('upsert_tags', { tag_names: tagsWithUrl });
        await loadTags(); // Refresh tags
      }

      const newPrompt: Prompt = {
        id: data.id,
        title: data.title,
        content: data.content,
        tags: data.tags || [],
        category: data.category,
        tone: data.tone,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        usageCount: data.usage_count,
        rating: data.rating,
        sourceUrl: data.source_url,
        aiModel: data.ai_model,
        isLongPrompt: data.is_long_prompt,
        versionNumber: data.version_number || 1,
        parentPromptId: data.parent_prompt_id,
        isCurrentVersion: data.is_current_version !== false,
        metadata: {
          ...(data.metadata as Record<string, any> || {}),
          originalCreatedAt: data.created_at,
          editedAt: data.edited_at || data.updated_at
        } as any
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
      // First, get the current prompt to create a version
      const { data: currentPrompt, error: fetchError } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Create a new version with the old content (preserving original created_at)
      const { error: versionError } = await supabase
        .from('prompts')
        .insert({
          title: currentPrompt.title,
          content: currentPrompt.content,
          tags: currentPrompt.tags,
          category: currentPrompt.category,
          tone: currentPrompt.tone,
          rating: currentPrompt.rating,
          user_id: currentPrompt.user_id,
          parent_prompt_id: id,
          version_number: (currentPrompt.version_number || 1),
          is_current_version: false,
          created_at: currentPrompt.created_at, // Preserve original creation time
          edited_at: currentPrompt.updated_at, // When this version was last edited
          metadata: {
            ...(currentPrompt.metadata as Record<string, any> || {}),
            originalCreatedAt: currentPrompt.created_at,
            versionCreatedAt: new Date().toISOString(),
            editHistory: 'Archived before edit'
          },
          source_url: currentPrompt.source_url,
          ai_model: currentPrompt.ai_model,
          is_long_prompt: currentPrompt.is_long_prompt
        });

      if (versionError) throw versionError;

      // Update the current prompt with new edited_at timestamp
      const { data, error } = await supabase
        .from('prompts')
        .update({
          title: updates.title,
          content: updates.content,
          tags: updates.tags,
          category: updates.category,
          tone: updates.tone,
          source_url: updates.sourceUrl,
          ai_model: updates.aiModel,
          rating: updates.rating,
          metadata: {
            ...(updates.metadata as Record<string, any> || {}),
            originalCreatedAt: currentPrompt.created_at,
            lastEditedAt: new Date().toISOString(),
            editCount: ((currentPrompt.metadata as any)?.editCount || 0) + 1
          } as any,
          version_number: (currentPrompt.version_number || 1) + 1,
          edited_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update tags in database if they changed
      if (updates.tags && updates.tags.length > 0) {
        await supabase.rpc('upsert_tags', { tag_names: updates.tags });
        await loadTags(); // Refresh tags
      }

      setPrompts(prev => prev.map(prompt => 
        prompt.id === id 
          ? { 
              ...prompt, 
              ...updates, 
              versionNumber: (currentPrompt.version_number || 1) + 1,
              updatedAt: new Date(data.updated_at) 
            }
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
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPrompts(prev => prev.filter(prompt => prompt.id !== id));
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const incrementUsage = async (id: string) => {
    try {
      const { error } = await supabase
        .rpc('increment_usage_count', { prompt_id: id });

      if (error) throw error;

      setPrompts(prev => prev.map(prompt => 
        prompt.id === id 
          ? { ...prompt, usageCount: prompt.usageCount + 1, updatedAt: new Date() }
          : prompt
      ));
    } catch (error) {
      console.error('Failed to increment usage:', error);
    }
  };

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
    allCategories,
    loadPrompts
  };
};