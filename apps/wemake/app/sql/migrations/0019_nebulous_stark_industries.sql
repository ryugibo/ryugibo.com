ALTER POLICY "post_replies-select-policy" ON "wemake"."post_replies" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "post_upvotes-select-policy" ON "wemake"."post_upvotes" TO anon USING (true);--> statement-breakpoint
ALTER POLICY "posts-select-policy" ON "wemake"."posts" TO anon USING (true);--> statement-breakpoint
ALTER POLICY "topics-insert-policy" ON "wemake"."topics" TO authenticated WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "topics-select-policy" ON "wemake"."topics" TO anon USING (true);--> statement-breakpoint
ALTER POLICY "idea_likes-select-policy" ON "wemake"."idea_likes" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "jobs-insert-policy" ON "wemake"."jobs" TO authenticated WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "jobs-select-policy" ON "wemake"."jobs" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "categories-select-policy" ON "wemake"."categories" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "product_upvotes-select-policy" ON "wemake"."product_upvotes" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "products-select-policy" ON "wemake"."products" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "reviews-select-policy" ON "wemake"."reviews" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "follows-select-policy" ON "wemake"."follows" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "message_room_members-select-policy" ON "wemake"."message_room_members" TO authenticated USING (true);--> statement-breakpoint
ALTER POLICY "message_rooms-insert-policy" ON "wemake"."message_rooms" TO authenticated WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "message_rooms-select-policy" ON "wemake"."message_rooms" TO authenticated USING (true);--> statement-breakpoint
ALTER POLICY "messages-insert-policy" ON "wemake"."messages" TO authenticated WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "messages-select-policy" ON "wemake"."messages" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "notifications-insert-policy" ON "wemake"."notifications" TO authenticated WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "notifications-select-policy" ON "wemake"."notifications" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "profiles-select-policy" ON "wemake"."profiles" TO anon,authenticated USING (true);