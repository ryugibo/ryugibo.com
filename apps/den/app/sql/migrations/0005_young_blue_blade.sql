ALTER TABLE "den"."series" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "den"."works" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "series-select-policy" ON "den"."series" AS PERMISSIVE FOR SELECT TO "anon", "authenticated", "service_role" USING (true);--> statement-breakpoint
CREATE POLICY "series-insert-policy" ON "den"."series" AS PERMISSIVE FOR INSERT TO "authenticated", "service_role" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "series-update-policy" ON "den"."series" AS PERMISSIVE FOR UPDATE TO "authenticated", "service_role" USING (true);--> statement-breakpoint
CREATE POLICY "series-delete-policy" ON "den"."series" AS PERMISSIVE FOR DELETE TO "service_role" USING (true);--> statement-breakpoint
CREATE POLICY "works-select-policy" ON "den"."works" AS PERMISSIVE FOR SELECT TO "anon", "authenticated", "service_role" USING (true);--> statement-breakpoint
CREATE POLICY "works-insert-policy" ON "den"."works" AS PERMISSIVE FOR INSERT TO "authenticated", "service_role" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "works-update-policy" ON "den"."works" AS PERMISSIVE FOR UPDATE TO "authenticated", "service_role" USING (true);--> statement-breakpoint
CREATE POLICY "works-delete-policy" ON "den"."works" AS PERMISSIVE FOR DELETE TO "service_role" USING (true);