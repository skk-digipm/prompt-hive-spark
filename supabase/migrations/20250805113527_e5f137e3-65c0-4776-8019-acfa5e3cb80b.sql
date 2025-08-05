-- Fix the security warning by adding search_path to the function
CREATE OR REPLACE FUNCTION public.create_prompt_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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