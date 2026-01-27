CREATE OR REPLACE FUNCTION wemake.track_event(
  event_type wemake.event_type,
  event_data jsonb
) RETURNS void AS $$
BEGIN
  INSERT INTO wemake.events (event_type, event_data)
  VALUES (event_type, event_data);
END;
$$ LANGUAGE plpgsql;
