ALTER TABLE "wemake"."notifications" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY "notifications-insert-policy" ON "wemake"."notifications" CASCADE;--> statement-breakpoint
DROP POLICY "notifications-select-policy" ON "wemake"."notifications" CASCADE;--> statement-breakpoint
DROP TABLE "wemake"."notifications" CASCADE;--> statement-breakpoint
DROP TYPE "wemake"."notification_type";--> statement-breakpoint
CREATE TYPE "wemake"."notification_type" AS ENUM('follow', 'review', 'reply');--> statement-breakpoint
ALTER TABLE "wemake"."follows" ALTER COLUMN "follower_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wemake"."follows" ALTER COLUMN "following_id" SET NOT NULL;