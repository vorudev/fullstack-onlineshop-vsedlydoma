CREATE TABLE "client_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"info" text NOT NULL,
	"about_id" uuid
);
--> statement-breakpoint
ALTER TABLE "client_info" ADD CONSTRAINT "client_info_about_id_about_id_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_info_about_id_idx" ON "client_info" USING btree ("about_id");