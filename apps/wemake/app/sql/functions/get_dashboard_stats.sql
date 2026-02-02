CREATE OR REPLACE FUNCTION wemake.get_dashboard_stats(profile_id uuid)
RETURNS TABLE (
  views bigint,
  month text
) AS $$
BEGIN
  RETURN QUERY
    SELECT
      COUNT(*) AS views,
      to_char(events.created_at, 'YYYY-MM') AS month
    FROM wemake.events AS events
    JOIN wemake.profiles AS profiles ON profiles.id = profile_id
    WHERE event_data ->> 'username' = profiles.username
    GROUP BY month;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM wemake.get_dashboard_stats('a00e9af2-116b-42c8-bec5-e44ab7fd4402');
