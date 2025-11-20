CREATE TABLE "about" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"home" text NOT NULL,
	"description" text NOT NULL,
	"client_info" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "two_factor" CASCADE;--> statement-breakpoint
CREATE INDEX "about_title_idx" ON "about" USING btree ("title");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "two_factor_enabled";