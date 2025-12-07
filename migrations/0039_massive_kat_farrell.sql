CREATE TABLE "admin_emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_emails_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "telegram_chat_ids" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "telegram_chat_ids_chat_id_unique" UNIQUE("chat_id")
);
--> statement-breakpoint
DROP TABLE "telegram_subscribers" CASCADE;--> statement-breakpoint
CREATE INDEX "admin_emails_email_idx" ON "admin_emails" USING btree ("email");--> statement-breakpoint
CREATE INDEX "telegram_chat_ids_chat_id_idx" ON "telegram_chat_ids" USING btree ("chat_id");