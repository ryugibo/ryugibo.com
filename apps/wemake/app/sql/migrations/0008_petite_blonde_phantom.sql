CREATE TYPE "wemake"."notification_type" AS ENUM('follow', 'review', 'reply', 'mention');--> statement-breakpoint
CREATE TABLE "wemake"."message_room_members" (
	"message_room_id" bigint,
	"profile_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "message_room_members_message_room_id_profile_id_pk" PRIMARY KEY("message_room_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "wemake"."message_rooms" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wemake"."message_rooms_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wemake"."messages" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wemake"."messages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"message_room_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"content" text NOT NULL,
	"seen" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wemake"."notifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"target_id" uuid NOT NULL,
	"source_id" uuid,
	"product_id" bigint,
	"post_id" bigint,
	"type" "wemake"."notification_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wemake"."message_room_members" ADD CONSTRAINT "message_room_members_message_room_id_message_rooms_id_fk" FOREIGN KEY ("message_room_id") REFERENCES "wemake"."message_rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."message_room_members" ADD CONSTRAINT "message_room_members_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."messages" ADD CONSTRAINT "messages_message_room_id_message_rooms_id_fk" FOREIGN KEY ("message_room_id") REFERENCES "wemake"."message_rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."messages" ADD CONSTRAINT "messages_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."notifications" ADD CONSTRAINT "notifications_target_id_profiles_id_fk" FOREIGN KEY ("target_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."notifications" ADD CONSTRAINT "notifications_source_id_profiles_id_fk" FOREIGN KEY ("source_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."notifications" ADD CONSTRAINT "notifications_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "wemake"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."notifications" ADD CONSTRAINT "notifications_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "wemake"."posts"("id") ON DELETE cascade ON UPDATE no action;