ALTER TABLE "den"."books" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "den"."profile_books" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "den"."profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "books-select-policy" ON "den"."books" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "profile_books-select-policy" ON "den"."profile_books" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "den"."profile_books"."profile_id");--> statement-breakpoint
CREATE POLICY "profile_books-insert-policy" ON "den"."profile_books" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "den"."profile_books"."profile_id");--> statement-breakpoint
CREATE POLICY "profile_books-update-policy" ON "den"."profile_books" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "den"."profile_books"."profile_id");--> statement-breakpoint
CREATE POLICY "profile_books-delete-policy" ON "den"."profile_books" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "den"."profile_books"."profile_id");--> statement-breakpoint
CREATE POLICY "profiles-select-policy" ON "den"."profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "den"."profiles"."id");--> statement-breakpoint
CREATE POLICY "profiles-insert-policy" ON "den"."profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "den"."profiles"."id");--> statement-breakpoint
CREATE POLICY "profiles-update-policy" ON "den"."profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "den"."profiles"."id");--> statement-breakpoint
CREATE POLICY "profiles-delete-policy" ON "den"."profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "den"."profiles"."id");