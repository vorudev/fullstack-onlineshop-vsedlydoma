CREATE TABLE "telegram_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" varchar(255) NOT NULL,
	"username" varchar(255),
	"first_name" varchar(255),
	"is_active" boolean DEFAULT true,
	"last_active" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "telegram_subscribers_chat_id_unique" UNIQUE("chat_id")
);
--> statement-breakpoint
DROP TABLE "reviews_images" CASCADE;--> statement-breakpoint
CREATE INDEX "telegram_subscribers_chat_id_idx" ON "telegram_subscribers" USING btree ("chat_id");