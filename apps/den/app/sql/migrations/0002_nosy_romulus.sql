ALTER TABLE "den"."profile" RENAME TO "profiles";--> statement-breakpoint
ALTER TABLE "den"."profile_books" DROP CONSTRAINT "profile_books_profile_id_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "den"."profiles" DROP CONSTRAINT "profile_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "den"."profile_books" ADD CONSTRAINT "profile_books_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "den"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "den"."profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;