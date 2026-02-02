ALTER TABLE "wemake"."message_rooms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "message_rooms-insert-policy" ON "wemake"."message_rooms" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "message_rooms-select-policy" ON "wemake"."message_rooms" AS PERMISSIVE FOR SELECT TO "authenticated";