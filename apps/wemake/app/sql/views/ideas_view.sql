CREATE OR REPLACE VIEW wemake.ideas_view AS
SELECT
  ideas.id,
  ideas.idea,
  ideas.views,
  CASE WHEN ideas.claimed_at IS NULL THEN FALSE ELSE TRUE END AS is_claimed,
  COUNT(idea_likes.idea_id) AS likes,
  ideas.created_at
FROM wemake.ideas AS ideas
LEFT JOIN wemake.idea_likes AS idea_likes ON ideas.id = idea_likes.idea_id
GROUP BY ideas.id;
