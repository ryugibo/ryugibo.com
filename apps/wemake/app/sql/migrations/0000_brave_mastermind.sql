CREATE SCHEMA IF NOT EXISTS "wemake";
--> statement-breakpoint
CREATE TYPE "wemake"."job_type" AS ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance');--> statement-breakpoint
CREATE TYPE "wemake"."location" AS ENUM('remote', 'in-person', 'hybrid');--> statement-breakpoint
CREATE TYPE "wemake"."salary_range" AS ENUM('$0 - $50,000', '$50,000 - $70,000', '$70,000 - $100,000', '$100,000 - $120,000', '$120,000 - $150,000', '$150,000 - $250,000', '$250,000+');--> statement-breakpoint
CREATE TABLE "wemake"."jobs" (
	"job_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wemake"."jobs_job_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"position" text NOT NULL,
	"overview" text NOT NULL,
	"responsibilities" text NOT NULL,
	"qualifications" text NOT NULL,
	"benefits" text NOT NULL,
	"skills" text NOT NULL,
	"company_name" text NOT NULL,
	"company_logo" text NOT NULL,
	"company_location" text NOT NULL,
	"apply_url" text NOT NULL,
	"job_type" "wemake"."job_type" NOT NULL,
	"location" "wemake"."location" NOT NULL,
	"salary_range" "wemake"."salary_range" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
