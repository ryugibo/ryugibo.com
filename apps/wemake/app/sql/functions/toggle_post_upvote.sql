CREATE OR REPLACE FUNCTION wemake.toggle_post_upvote(
  post_id bigint,
  profile_id uuid
) RETURNS void AS $$
DECLARE
  exists_check boolean;
BEGIN
  -- Check if the upvote already exists
  SELECT EXISTS (
    SELECT 1
    FROM wemake.post_upvotes AS pu
    WHERE pu.post_id = toggle_post_upvote.post_id
      AND pu.profile_id = toggle_post_upvote.profile_id
  ) INTO exists_check;

  IF exists_check THEN
    -- If it exists, delete it
    DELETE FROM wemake.post_upvotes AS pu
    WHERE pu.post_id = toggle_post_upvote.post_id
      AND pu.profile_id = toggle_post_upvote.profile_id;
  ELSE
    -- If it doesn't exist, insert it
    INSERT INTO wemake.post_upvotes (post_id, profile_id)
    VALUES (toggle_post_upvote.post_id, toggle_post_upvote.profile_id);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
