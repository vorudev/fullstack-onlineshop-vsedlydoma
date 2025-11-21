CREATE TABLE "contact_us_telephones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(255) NOT NULL,
	"contact_us_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "contact_phones" ADD COLUMN "src" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_us_telephones" ADD CONSTRAINT "contact_us_telephones_contact_us_id_contact_us_id_fk" FOREIGN KEY ("contact_us_id") REFERENCES "public"."contact_us"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "contact_us_telephones_contact_us_id_idx" ON "contact_us_telephones" USING btree ("contact_us_id");