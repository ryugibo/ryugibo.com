CREATE TABLE "wemake"."notifications" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wemake"."notifications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"target_id" uuid NOT NULL,
	"source_id" uuid,
	"product_id" bigint,
	"post_id" bigint,
	"type" "wemake"."notification_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wemake"."notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wemake"."notifications" ADD CONSTRAINT "notifications_target_id_profiles_id_fk" FOREIGN KEY ("target_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."notifications" ADD CONSTRAINT "notifications_source_id_profiles_id_fk" FOREIGN KEY ("source_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."notifications" ADD CONSTRAINT "notifications_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "wemake"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."notifications" ADD CONSTRAINT "notifications_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "wemake"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "notifications-insert-policy" ON "wemake"."notifications" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "notifications-select-policy" ON "wemake"."notifications" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);