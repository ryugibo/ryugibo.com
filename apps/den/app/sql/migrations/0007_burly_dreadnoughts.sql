CREATE TABLE "den"."book_grouping_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"book_isbn" text NOT NULL,
	"request_type" text NOT NULL,
	"message" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "den"."book_grouping_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "den"."profiles" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "den"."book_grouping_requests" ADD CONSTRAINT "book_grouping_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "book_grouping_requests-select-policy" ON "den"."book_grouping_requests" AS PERMISSIVE FOR SELECT TO "authenticated", "service_role" USING (true);--> statement-breakpoint
CREATE POLICY "book_grouping_requests-insert-policy" ON "den"."book_grouping_requests" AS PERMISSIVE FOR INSERT TO "authenticated", "service_role" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "book_grouping_requests-update-policy" ON "den"."book_grouping_requests" AS PERMISSIVE FOR UPDATE TO "authenticated", "service_role" USING (true);