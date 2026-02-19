DROP POLICY "profile_books-insert-policy" ON "den"."books" CASCADE;--> statement-breakpoint
DROP POLICY "profile_books-update-policy" ON "den"."books" CASCADE;--> statement-breakpoint
DROP POLICY "profile_books-delete-policy" ON "den"."books" CASCADE;--> statement-breakpoint
CREATE POLICY "books-insert-policy" ON "den"."books" AS PERMISSIVE FOR INSERT TO "authenticated", "service_role" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "books-update-policy" ON "den"."books" AS PERMISSIVE FOR UPDATE TO "authenticated", "service_role" USING (true);--> statement-breakpoint
CREATE POLICY "books-delete-policy" ON "den"."books" AS PERMISSIVE FOR DELETE TO "service_role" USING (true);