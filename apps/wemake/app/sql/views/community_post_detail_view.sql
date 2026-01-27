CREATE OR REPLACE VIEW wemake.community_post_detail_view AS
SELECT
  post.id,
  post.title,
  post.content,
  post.upvotes,
  post.created_at,
  topic.name AS topic_name,
  topic.slug AS topic_slug,
  COUNT(reply.id) as replies,
  profile.username AS author_name,
  profile.avatar AS author_avatar,
  profile.role AS author_role,
  profile.created_at AS author_created_at,
  (SELECT COUNT(*) FROM wemake.products WHERE wemake.products.profile_id = profile.id) AS author_products
FROM wemake.posts AS post
INNER JOIN wemake.topics AS topic ON post.topic_id = topic.id
LEFT JOIN wemake.post_replies AS reply ON post.id = reply.post_id
INNER JOIN wemake.profiles AS profile ON post.profile_id = profile.id
GROUP BY post.id, topic.id, profile.id;
