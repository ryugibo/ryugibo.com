CREATE TYPE "wemake"."product_stage" AS ENUM('idea', 'prototype', 'mvp', 'production');--> statement-breakpoint
CREATE TABLE "wemake"."teams" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wemake"."teams_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"team_size" integer NOT NULL,
	"equity_split" integer NOT NULL,
	"roles" text NOT NULL,
	"product_name" text NOT NULL,
	"product_stage" "wemake"."product_stage" NOT NULL,
	"product_description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_size_check" CHECK ("wemake"."teams"."team_size" BETWEEN 1 AND 100),
	CONSTRAINT "equilty_split_check" CHECK ("wemake"."teams"."equity_split" BETWEEN 1 AND 100),
	CONSTRAINT "product_description_check" CHECK (LENGTH("wemake"."teams"."product_description") <= 200)
);
