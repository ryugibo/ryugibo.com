ALTER POLICY "post_upvotes-select-policy" ON "wemake"."post_upvotes" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "posts-select-policy" ON "wemake"."posts" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "topics-select-policy" ON "wemake"."topics" TO anon,authenticated USING (true);--> statement-breakpoint
ALTER POLICY "teams-select-policy" ON "wemake"."teams" TO anon,authenticated USING (true);