CREATE SCHEMA "snipt";
--> statement-breakpoint
CREATE TABLE "snipt"."profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "snipt"."profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "snipt"."snippets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "snipt"."snippets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "snipt"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "snipt"."profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "snipt"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snipt"."snippets" ADD CONSTRAINT "snippets_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "snipt"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snipt"."users" ADD CONSTRAINT "users_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "profiles-select-policy" ON "snipt"."profiles" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ("snipt"."profiles"."public" OR (select auth.uid()) = "snipt"."profiles"."id");--> statement-breakpoint
CREATE POLICY "profiles-insert-policy" ON "snipt"."profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "snipt"."profiles"."id");--> statement-breakpoint
CREATE POLICY "profiles-update-policy" ON "snipt"."profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "snipt"."profiles"."id");--> statement-breakpoint
CREATE POLICY "profiles-delete-policy" ON "snipt"."profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "snipt"."profiles"."id");--> statement-breakpoint
CREATE POLICY "snippets-select-policy" ON "snipt"."snippets" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ((select auth.uid()) = "snipt"."snippets"."profile_id" OR EXISTS (SELECT 1 FROM snipt.profiles WHERE id = "snipt"."snippets"."profile_id" AND public = true));--> statement-breakpoint
CREATE POLICY "snippets-insert-policy" ON "snipt"."snippets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "snipt"."snippets"."profile_id");--> statement-breakpoint
CREATE POLICY "snippets-update-policy" ON "snipt"."snippets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "snipt"."snippets"."profile_id");--> statement-breakpoint
CREATE POLICY "snippets-delete-policy" ON "snipt"."snippets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "snipt"."snippets"."profile_id");