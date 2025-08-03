-- Add version history support to prompts table
ALTER TABLE public.prompts ADD COLUMN version_number INTEGER DEFAULT 1;
ALTER TABLE public.prompts ADD COLUMN parent_prompt_id UUID REFERENCES public.prompts(id);
ALTER TABLE public.prompts ADD COLUMN is_current_version BOOLEAN DEFAULT true;

-- Create index for better performance on version queries
CREATE INDEX idx_prompts_parent_version ON public.prompts(parent_prompt_id, version_number);
CREATE INDEX idx_prompts_current_version ON public.prompts(is_current_version) WHERE is_current_version = true;