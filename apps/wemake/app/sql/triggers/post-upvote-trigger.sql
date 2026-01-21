CREATE FUNCTION wemake.handle_post_upvote()
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

CREATE TRIGGER post_upvote_trigger
AFTER INSERT ON wemake.post_upvotes
FOR EACH ROW EXECUTE FUNCTION wemake.handle_post_upvote();

CREATE FUNCTION wemake.handle_post_unvote()
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

CREATE TRIGGER post_unvote_trigger
AFTER DELETE ON wemake.post_upvotes
FOR EACH ROW EXECUTE FUNCTION wemake.handle_post_unvote();
