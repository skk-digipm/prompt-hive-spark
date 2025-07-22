-- Create function to increment usage count for prompts
CREATE OR REPLACE FUNCTION public.increment_usage_count(prompt_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.prompts 
  SET usage_count = usage_count + 1,
      updated_at = now()
  WHERE id = prompt_id;
END;
$$;