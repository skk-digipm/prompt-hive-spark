-- Add edited_at column to track when each version was edited
ALTER TABLE public.prompts 
ADD COLUMN edited_at TIMESTAMP WITH TIME ZONE;

-- Update existing records to set edited_at same as updated_at
UPDATE public.prompts 
SET edited_at = updated_at;

-- Create function to handle version creation with proper timestamps
CREATE OR REPLACE FUNCTION public.create_prompt_version()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- When updating a current version, preserve original created_at in metadata
  IF OLD.is_current_version = true AND NEW.is_current_version = true THEN
    NEW.edited_at = now();
    NEW.metadata = COALESCE(NEW.metadata, '{}'::jsonb) || 
                   jsonb_build_object(
                     'originalCreatedAt', OLD.created_at,
                     'editedAt', now(),
                     'previousVersion', OLD.version_number
                   );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for automatic version metadata
CREATE TRIGGER update_prompt_version_metadata
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.create_prompt_version();