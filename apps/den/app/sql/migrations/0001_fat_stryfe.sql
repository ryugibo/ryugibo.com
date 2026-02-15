CREATE TYPE "den"."book_sources" AS ENUM('kyobo', 'aladin', 'yes24', 'ridibooks', 'etc');--> statement-breakpoint
CREATE TYPE "den"."read_state" AS ENUM('reading', 'toread', 'completed');--> statement-breakpoint
CREATE TABLE "den"."books" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "den"."books_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"isbn" text NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "books_isbn_unique" UNIQUE("isbn")
);
--> statement-breakpoint
ALTER TABLE "den"."books" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "den"."profile_books" (
	"profile_id" uuid,
	"book_id" bigint,
	"source" "den"."book_sources" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_books_profile_id_book_id_pk" PRIMARY KEY("profile_id","book_id")
);
--> statement-breakpoint
ALTER TABLE "den"."profile_books" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "den"."profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text DEFAULT (auth.jwt() ->> 'email'),
	"username" text NOT NULL,
	"public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "den"."profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "den"."profile_books" ADD CONSTRAINT "profile_books_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "den"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "den"."profile_books" ADD CONSTRAINT "profile_books_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "den"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "den"."profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "books-select-policy" ON "den"."books" AS PERMISSIVE FOR SELECT TO "anon", "authenticated", "service_role" USING (true);--> statement-breakpoint
CREATE POLICY "profile_books-insert-policy" ON "den"."books" AS PERMISSIVE FOR INSERT TO "authenticated", "service_role" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "profile_books-update-policy" ON "den"."books" AS PERMISSIVE FOR UPDATE TO "authenticated", "service_role" USING (true);--> statement-breakpoint
CREATE POLICY "profile_books-delete-policy" ON "den"."books" AS PERMISSIVE FOR DELETE TO "service_role" USING (true);--> statement-breakpoint
CREATE POLICY "profile_books-select-policy" ON "den"."profile_books" AS PERMISSIVE FOR SELECT TO "authenticated", "service_role" USING ((select auth.uid()) = "den"."profile_books"."profile_id" OR (SELECT public FROM "den"."profiles" WHERE id = "den"."profile_books"."profile_id"));--> statement-breakpoint
CREATE POLICY "profile_books-insert-policy" ON "den"."profile_books" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "den"."profile_books"."profile_id");--> statement-breakpoint
CREATE POLICY "profile_books-update-policy" ON "den"."profile_books" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "den"."profile_books"."profile_id");--> statement-breakpoint
CREATE POLICY "profile_books-delete-policy" ON "den"."profile_books" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "den"."profile_books"."profile_id");--> statement-breakpoint
CREATE POLICY "profiles-select-policy" ON "den"."profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("den"."profiles"."public" OR (select auth.uid()) = "den"."profiles"."id");--> statement-breakpoint
CREATE POLICY "profiles-insert-policy" ON "den"."profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "den"."profiles"."id");--> statement-breakpoint
CREATE POLICY "profiles-update-policy" ON "den"."profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "den"."profiles"."id");--> statement-breakpoint
CREATE POLICY "profiles-delete-policy" ON "den"."profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "den"."profiles"."id");