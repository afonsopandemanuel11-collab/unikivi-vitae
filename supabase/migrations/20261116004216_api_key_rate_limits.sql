CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

CREATE TABLE private.api_key_rate_limits (
  api_key_id uuid PRIMARY KEY
    REFERENCES public.api_keys(id) ON DELETE CASCADE,
  window_started_at timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 0 CHECK (request_count >= 0)
);

ALTER TABLE private.api_key_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE private.api_key_rate_limits FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE private.api_key_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.consume_api_key_request(
  p_api_key_id uuid,
  p_limit integer
)
RETURNS TABLE (allowed boolean, remaining integer, reset_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_now timestamptz := pg_catalog.clock_timestamp();
  v_window_started_at timestamptz;
  v_request_count integer;
BEGIN
  IF p_limit < 1 OR p_limit > 1000 THEN
    RAISE EXCEPTION 'Invalid API request limit';
  END IF;

  INSERT INTO private.api_key_rate_limits AS current_window (
    api_key_id,
    window_started_at,
    request_count
  )
  VALUES (p_api_key_id, v_now, 1)
  ON CONFLICT (api_key_id) DO UPDATE
  SET
    window_started_at = CASE
      WHEN v_now >= current_window.window_started_at + INTERVAL '1 minute' THEN v_now
      ELSE current_window.window_started_at
    END,
    request_count = CASE
      WHEN v_now >= current_window.window_started_at + INTERVAL '1 minute' THEN 1
      ELSE current_window.request_count + 1
    END
  RETURNING current_window.window_started_at, current_window.request_count
  INTO v_window_started_at, v_request_count;

  UPDATE public.api_keys
  SET
    last_used_at = v_now,
    request_count = public.api_keys.request_count + 1
  WHERE id = p_api_key_id AND status = 'ACTIVE';

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, v_now;
    RETURN;
  END IF;

  RETURN QUERY SELECT
    v_request_count <= p_limit,
    CASE WHEN p_limit > v_request_count THEN p_limit - v_request_count ELSE 0 END,
    v_window_started_at + INTERVAL '1 minute';
END;
$$;

REVOKE ALL ON FUNCTION public.consume_api_key_request(uuid, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_api_key_request(uuid, integer)
  TO service_role;
