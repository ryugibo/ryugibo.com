ALTER TABLE "wemake"."events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."post_replies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."post_upvotes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."topics" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."idea_likes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."ideas" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."jobs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."product_upvotes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."reviews" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."teams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."follows" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."message_room_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "events-insert-policy" ON "wemake"."events" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "post_replies-insert-policy" ON "wemake"."post_replies" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "wemake"."post_replies"."profile_id");--> statement-breakpoint
CREATE POLICY "post_replies-update-policy" ON "wemake"."post_replies" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "wemake"."post_replies"."profile_id");--> statement-breakpoint
CREATE POLICY "post_replies-delete-policy" ON "wemake"."post_replies" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "wemake"."post_replies"."profile_id");--> statement-breakpoint
CREATE POLICY "post_replies-select-policy" ON "wemake"."post_replies" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";--> statement-breakpoint
CREATE POLICY "post_upvotes-insert-policy" ON "wemake"."post_upvotes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "wemake"."post_upvotes"."profile_id");--> statement-breakpoint
CREATE POLICY "post_upvotes-delete-policy" ON "wemake"."post_upvotes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "wemake"."post_upvotes"."profile_id");--> statement-breakpoint
CREATE POLICY "post_upvotes-select-policy" ON "wemake"."post_upvotes" AS PERMISSIVE FOR SELECT TO "anon";--> statement-breakpoint
CREATE POLICY "posts-insert-policy" ON "wemake"."posts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "wemake"."posts"."profile_id");--> statement-breakpoint
CREATE POLICY "posts-update-policy" ON "wemake"."posts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "wemake"."posts"."profile_id");--> statement-breakpoint
CREATE POLICY "posts-delete-policy" ON "wemake"."posts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "wemake"."posts"."profile_id");--> statement-breakpoint
CREATE POLICY "posts-select-policy" ON "wemake"."posts" AS PERMISSIVE FOR SELECT TO "anon";--> statement-breakpoint
CREATE POLICY "topics-insert-policy" ON "wemake"."topics" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "topics-select-policy" ON "wemake"."topics" AS PERMISSIVE FOR SELECT TO "anon";--> statement-breakpoint
CREATE POLICY "idea_likes-insert-policy" ON "wemake"."idea_likes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "wemake"."idea_likes"."profile_id");--> statement-breakpoint
CREATE POLICY "idea_likes-delete-policy" ON "wemake"."idea_likes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "wemake"."idea_likes"."profile_id");--> statement-breakpoint
CREATE POLICY "idea_likes-select-policy" ON "wemake"."idea_likes" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";--> statement-breakpoint
CREATE POLICY "ideas-insert-policy" ON "wemake"."ideas" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "ideas-select-anon-policy" ON "wemake"."ideas" AS PERMISSIVE FOR SELECT TO "anon" USING ("wemake"."ideas"."claimed_by" IS NULL);--> statement-breakpoint
CREATE POLICY "ideas-select-auth-policy" ON "wemake"."ideas" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("wemake"."ideas"."claimed_by" IS NULL OR "wemake"."ideas"."claimed_by" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "jobs-insert-policy" ON "wemake"."jobs" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "jobs-select-policy" ON "wemake"."jobs" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";--> statement-breakpoint
CREATE POLICY "categories-select-policy" ON "wemake"."categories" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";--> statement-breakpoint
CREATE POLICY "product_upvotes-insert-policy" ON "wemake"."product_upvotes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "wemake"."product_upvotes"."profile_id");--> statement-breakpoint
CREATE POLICY "product_upvotes-delete-policy" ON "wemake"."product_upvotes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "wemake"."product_upvotes"."profile_id");--> statement-breakpoint
CREATE POLICY "product_upvotes-select-policy" ON "wemake"."product_upvotes" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";--> statement-breakpoint
CREATE POLICY "products-insert-policy" ON "wemake"."products" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "wemake"."products"."profile_id");--> statement-breakpoint
CREATE POLICY "products-select-policy" ON "wemake"."products" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";--> statement-breakpoint
CREATE POLICY "reviews-insert-policy" ON "wemake"."reviews" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "wemake"."reviews"."profile_id");--> statement-breakpoint
CREATE POLICY "reviews-update-policy" ON "wemake"."reviews" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "wemake"."reviews"."profile_id");--> statement-breakpoint
CREATE POLICY "reviews-delete-policy" ON "wemake"."reviews" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "wemake"."reviews"."profile_id");--> statement-breakpoint
CREATE POLICY "reviews-select-policy" ON "wemake"."reviews" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";--> statement-breakpoint
CREATE POLICY "teams-insert-policy" ON "wemake"."teams" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "wemake"."teams"."team_leader_id");--> statement-breakpoint
CREATE POLICY "teams-select-policy" ON "wemake"."teams" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";--> statement-breakpoint
CREATE POLICY "follows-insert-policy" ON "wemake"."follows" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "wemake"."follows"."follower_id" OR (select auth.uid()) = "wemake"."follows"."following_id");--> statement-breakpoint
CREATE POLICY "follows-delete-policy" ON "wemake"."follows" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "wemake"."follows"."follower_id" OR (select auth.uid()) = "wemake"."follows"."following_id");--> statement-breakpoint
CREATE POLICY "follows-select-policy" ON "wemake"."follows" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";--> statement-breakpoint
CREATE POLICY "message_room_members-insert-policy" ON "wemake"."message_room_members" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "wemake"."message_room_members"."profile_id");--> statement-breakpoint
CREATE POLICY "message_room_members-delete-policy" ON "wemake"."message_room_members" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "wemake"."message_room_members"."profile_id");--> statement-breakpoint
CREATE POLICY "message_room_members-select-policy" ON "wemake"."message_room_members" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "messages-insert-policy" ON "wemake"."messages" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "messages-select-policy" ON "wemake"."messages" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";--> statement-breakpoint
CREATE POLICY "notifications-insert-policy" ON "wemake"."notifications" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "notifications-select-policy" ON "wemake"."notifications" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";--> statement-breakpoint
CREATE POLICY "profiles-update-policy" ON "wemake"."profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "wemake"."profiles"."id");--> statement-breakpoint
CREATE POLICY "profiles-select-policy" ON "wemake"."profiles" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";