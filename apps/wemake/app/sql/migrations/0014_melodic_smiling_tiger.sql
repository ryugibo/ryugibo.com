CREATE TYPE "wemake"."event_type" AS ENUM('product_view', 'product_visit', 'profile_view');--> statement-breakpoint
CREATE TABLE "wemake"."events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "wemake"."event_type" NOT NULL,
	"event_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
