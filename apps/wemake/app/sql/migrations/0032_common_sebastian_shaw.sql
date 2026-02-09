-- Custom SQL migration file, put your code below! --

-- get_dashboard_stats.sql
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

-- get_product_stats.sql
CREATE OR REPLACE FUNCTION wemake.get_product_stats(product_id text)
RETURNS TABLE (
  product_views bigint,
  product_visits bigint,
  month text
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    SUM(CASE WHEN event_type = 'product_view' THEN 1 ELSE 0 END) AS product_views,
    SUM(CASE WHEN event_type = 'product_visit' THEN 1 ELSE 0 END) AS product_visits,
    to_char(events.created_at, 'YYYY-MM') AS month
  FROM wemake.events
  WHERE event_data ->> 'product_id' = product_id
  GROUP BY month;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM wemake.get_product_stats('3');

-- toggle_post_upvote.sql
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

-- trigger_event.sql
CREATE OR REPLACE FUNCTION wemake.track_event(
  event_type wemake.event_type,
  event_data jsonb
) RETURNS void AS $$
BEGIN
  INSERT INTO wemake.events (event_type, event_data)
  VALUES (event_type, event_data);
END;
$$ LANGUAGE plpgsql;

-- notification_trigger.sql
CREATE OR REPLACE FUNCTION wemake.notify_follow()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = ''
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO wemake.notifications (type, source_id, target_id)
    VALUES ('follow', NEW.follower_id, NEW.following_id);
    RETURN NEW;
END;
$$;--> statement-breakpoint

CREATE OR REPLACE TRIGGER notify_follow_trigger
AFTER INSERT ON wemake.follows
FOR EACH ROW
EXECUTE PROCEDURE wemake.notify_follow();--> statement-breakpoint

CREATE OR REPLACE FUNCTION wemake.notify_review()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
    product_owner uuid;
BEGIN
    SELECT profile_id INTO product_owner FROM wemake.products WHERE id = NEW.product_id;
    INSERT INTO wemake.notifications (type, source_id, target_id, product_id)
    VALUES ('review', NEW.profile_id, product_owner, NEW.product_id);
    RETURN NEW;
END;
$$;--> statement-breakpoint

CREATE OR REPLACE TRIGGER notify_review_trigger
AFTER INSERT ON wemake.reviews
FOR EACH ROW
EXECUTE PROCEDURE wemake.notify_review();--> statement-breakpoint

CREATE OR REPLACE FUNCTION wemake.notify_reply()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
    post_owner uuid;
BEGIN
    SELECT profile_id INTO post_owner FROM wemake.posts WHERE id = NEW.post_id;
    INSERT INTO wemake.notifications (type, source_id, target_id, post_id)
    VALUES ('reply', NEW.profile_id, post_owner, NEW.post_id);
    RETURN NEW;
END;
$$;--> statement-breakpoint

CREATE OR REPLACE TRIGGER notify_reply_trigger
AFTER INSERT ON wemake.post_replies
FOR EACH ROW
EXECUTE PROCEDURE wemake.notify_reply();

-- post_upvote_trigger.sql
CREATE OR REPLACE FUNCTION wemake.handle_post_upvote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE wemake.posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER post_upvote_trigger
AFTER INSERT ON wemake.post_upvotes
FOR EACH ROW EXECUTE FUNCTION wemake.handle_post_upvote();

CREATE OR REPLACE FUNCTION wemake.handle_post_unvote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE wemake.posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER post_unvote_trigger
AFTER DELETE ON wemake.post_upvotes
FOR EACH ROW EXECUTE FUNCTION wemake.handle_post_unvote();

-- community_post_detail_view.sql
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
  (SELECT COUNT(*) FROM wemake.products WHERE wemake.products.profile_id = profile.id) AS author_products,
  (SELECT EXISTS (SELECT 1 FROM wemake.post_upvotes WHERE post_upvotes.post_id = post.id AND post_upvotes.profile_id = auth.uid())) AS is_upvoted
FROM wemake.posts AS post
INNER JOIN wemake.topics AS topic ON post.topic_id = topic.id
LEFT JOIN wemake.post_replies AS reply ON post.id = reply.post_id
INNER JOIN wemake.profiles AS profile ON post.profile_id = profile.id
GROUP BY post.id, topic.id, profile.id;

SELECT * FROM wemake.community_post_detail_view;

-- community_post_list_view.sql
CREATE OR REPLACE VIEW wemake.community_post_list_view AS
SELECT
  posts.id,
  posts.title,
  posts.created_at,
  topics.name AS topic,
  profiles.name AS author,
  profiles.avatar AS author_avatar,
  profiles.username AS author_username,
  posts.upvotes,
  topics.slug AS topic_slug,
  (SELECT EXISTS (SELECT 1 FROM wemake.post_upvotes WHERE post_upvotes.post_id = posts.id AND post_upvotes.profile_id = auth.uid())) AS is_upvoted
FROM wemake.posts AS posts
INNER JOIN wemake.topics AS topics ON posts.topic_id = topics.id
INNER JOIN wemake.profiles AS profiles ON posts.profile_id = profiles.id
LEFT JOIN wemake.post_upvotes as post_upvotes ON posts.id = post_upvotes.post_id
GROUP BY posts.id, topics.id, profiles.id;

SELECT * FROM wemake.community_post_list_view;

-- ideas_view.sql
CREATE OR REPLACE VIEW wemake.ideas_view AS
SELECT
  ideas.id,
  CASE WHEN ideas.claimed_at IS NULL THEN ideas.idea ELSE 'claimedclaimedclaimedclaimedclaimedclaimedclaimed' END AS idea,
  ideas.views,
  CASE WHEN ideas.claimed_at IS NULL THEN FALSE ELSE TRUE END AS is_claimed,
  COUNT(idea_likes.idea_id) AS likes,
  ideas.created_at
FROM wemake.ideas AS ideas
LEFT JOIN wemake.idea_likes AS idea_likes ON ideas.id = idea_likes.idea_id
GROUP BY ideas.id;

-- product_over_view.sql
CREATE OR REPLACE VIEW wemake.product_overview_view AS
SELECT
  p.id,
  p.name,
  p.tagline,
  p.description,
  p.how_it_works,
  p.icon,
  p.url,
  p.stats->>'upvotes' AS upvotes,
  p.stats->>'views' AS views,
  p.stats->>'reviews' AS reviews,
  AVG(r.rating) AS average_rating
FROM wemake.products AS p
LEFT JOIN wemake.reviews AS r ON p.id = r.product_id
GROUP BY p.id;

-- grant_anon_authenticated_role_access_to_wemake.sql
-- 1. anon(비로그인)과 authenticated(로그인 유저)에게 'wemake' 스키마를 사용할 수 있는 권한 부여
GRANT USAGE ON SCHEMA wemake TO anon, authenticated;--> statement-breakpoint

-- 2. 'wemake' 스키마 내의 현재 존재하는 모든 테이블에 대해 조회(SELECT) 권한 부여
GRANT SELECT ON ALL TABLES IN SCHEMA wemake TO anon, authenticated;--> statement-breakpoint

-- 3. (필요한 경우) 데이터 생성, 수정, 삭제 권한도 부여
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA wemake TO anon, authenticated;--> statement-breakpoint

-- 4. 앞으로 'wemake' 스키마에 새로 생성될 테이블들도 자동으로 권한이 부여되도록 설정
ALTER DEFAULT PRIVILEGES IN SCHEMA wemake GRANT ALL ON TABLES TO anon, authenticated;--> statement-breakpoint
