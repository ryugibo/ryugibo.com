CREATE TYPE "den"."book_sources" AS ENUM('kyobo', 'aladin', 'yes24', 'ridibooks', 'etc');--> statement-breakpoint
CREATE TABLE "den"."profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"avatar" text,
	"bio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "den"."books" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "den"."books_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"isbn" text,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"cover" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "den"."profile_books" (
	"profile_id" uuid,
	"book_id" bigint,
	"source" "den"."book_sources" NOT NULL,
	"source_etc" text,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "den"."profile" ADD CONSTRAINT "profile_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "den"."profile_books" ADD CONSTRAINT "profile_books_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "den"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "den"."profile_books" ADD CONSTRAINT "profile_books_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "den"."books"("id") ON DELETE cascade ON UPDATE no action;