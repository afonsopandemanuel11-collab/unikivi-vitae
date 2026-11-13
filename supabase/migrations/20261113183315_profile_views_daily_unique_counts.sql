ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS views_count bigint NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.profile_views (
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visitor_id uuid NOT NULL,
  viewed_on date NOT NULL DEFAULT (timezone('utc', now())::date),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, visitor_id, viewed_on)
);

ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.profile_views FROM anon, authenticated;
GRANT INSERT ON public.profile_views TO service_role;
GRANT UPDATE (views_count) ON public.profiles TO service_role;

CREATE FUNCTION public.add_profile_view_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET views_count = views_count + 1
  WHERE id = NEW.profile_id;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.add_profile_view_count() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER profile_views_increment_count
AFTER INSERT ON public.profile_views
FOR EACH ROW
EXECUTE FUNCTION public.add_profile_view_count();
