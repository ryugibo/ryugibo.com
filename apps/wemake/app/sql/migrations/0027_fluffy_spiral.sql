-- Custom SQL migration file, put your code below! --

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
