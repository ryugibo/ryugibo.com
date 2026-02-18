CREATE TABLE "den"."series" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "den"."works" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"series_id" uuid,
	"series_order" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "den"."books" ADD COLUMN "work_id" uuid;--> statement-breakpoint
ALTER TABLE "den"."works" ADD CONSTRAINT "works_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "den"."series"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "den"."books" ADD CONSTRAINT "books_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "den"."works"("id") ON DELETE set null ON UPDATE no action;