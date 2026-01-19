CREATE TABLE "wemake"."categories" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wemake"."categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wemake"."product_upvotes" (
	"product_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_upvotes_product_id_profile_id_pk" PRIMARY KEY("product_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "wemake"."products" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wemake"."products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"tagline" text NOT NULL,
	"description" text NOT NULL,
	"how_it_works" text NOT NULL,
	"icon" text NOT NULL,
	"url" text NOT NULL,
	"stats" jsonb DEFAULT '{"views":0,"reviews":0}'::jsonb NOT NULL,
	"profile_id" uuid NOT NULL,
	"category_id" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wemake"."reviews" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wemake"."reviews_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"product_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rating_check" CHECK ("wemake"."reviews"."rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
ALTER TABLE "wemake"."profiles" RENAME COLUMN "profile_id" TO "id";--> statement-breakpoint
ALTER TABLE "wemake"."follows" DROP CONSTRAINT "follows_follower_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "wemake"."follows" DROP CONSTRAINT "follows_following_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "wemake"."profiles" DROP CONSTRAINT "profiles_profile_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "wemake"."product_upvotes" ADD CONSTRAINT "product_upvotes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "wemake"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."product_upvotes" ADD CONSTRAINT "product_upvotes_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."products" ADD CONSTRAINT "products_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "wemake"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "wemake"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."reviews" ADD CONSTRAINT "reviews_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."follows" ADD CONSTRAINT "follows_follower_id_profiles_id_fk" FOREIGN KEY ("follower_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."follows" ADD CONSTRAINT "follows_following_id_profiles_id_fk" FOREIGN KEY ("following_id") REFERENCES "wemake"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wemake"."profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;