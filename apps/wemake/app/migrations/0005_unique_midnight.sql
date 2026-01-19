CREATE TABLE "wemake"."post_replies" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wemake"."post_replies_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"content" text NOT NULL,
	"post_id" bigint NOT NULL,
	"parent_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wemake"."post_upvotes" (
	"post_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	CONSTRAINT "post_upvotes_post_id_profile_id_pk" PRIMARY KEY("post_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "wemake"."posts" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wemake"."posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"content" text NOT NULL,
	"topic_id" bigint NOT NULL,
	"profile_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wemake"."topics" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wemake"."topics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wemake"."post_replies" ADD CONSTRAINT "post_replies_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "wemake"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."post_replies" ADD CONSTRAINT "post_replies_parent_id_post_replies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "wemake"."post_replies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."post_replies" ADD CONSTRAINT "post_replies_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."post_upvotes" ADD CONSTRAINT "post_upvotes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "wemake"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."post_upvotes" ADD CONSTRAINT "post_upvotes_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."posts" ADD CONSTRAINT "posts_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "wemake"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."posts" ADD CONSTRAINT "posts_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;