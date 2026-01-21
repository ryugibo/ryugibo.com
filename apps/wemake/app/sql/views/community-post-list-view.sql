CREATE VIEW wemake.community_post_list_view AS
SELECT
  posts.id,
  posts.title,
  posts.created_at,
  topics.name AS topic,
  profiles.name AS author,
  profiles.avatar AS author_avatar,
  profiles.username AS author_username,
  COUNT(post_upvotes.post_id) AS upvotes
FROM wemake.posts AS posts
INNER JOIN wemake.topics AS topics ON posts.topic_id = topics.id
INNER JOIN wemake.profiles AS profiles ON posts.profile_id = profiles.id
LEFT JOIN wemake.post_upvotes as post_upvotes ON posts.id = post_upvotes.post_id
GROUP BY posts.id, topics.id, profiles.id;
