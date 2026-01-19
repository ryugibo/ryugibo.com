CREATE TABLE "wemake"."idea_likes" (
	"idea_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	CONSTRAINT "idea_likes_idea_id_profile_id_pk" PRIMARY KEY("idea_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "wemake"."ideas" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wemake"."ideas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"idea" text NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"claimed_at" timestamp,
	"claimed_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wemake"."idea_likes" ADD CONSTRAINT "idea_likes_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "wemake"."ideas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."idea_likes" ADD CONSTRAINT "idea_likes_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."ideas" ADD CONSTRAINT "ideas_claimed_by_profiles_id_fk" FOREIGN KEY ("claimed_by") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;