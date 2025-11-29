CREATE TABLE "reviews_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"storage_type" text DEFAULT 'url' NOT NULL,
	"storage_key" text,
	"order" integer DEFAULT 0,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "news_images" ADD COLUMN "is_article" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "reviews_images" ADD CONSTRAINT "reviews_images_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reviews_images_review_id_idx" ON "reviews_images" USING btree ("review_id");--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_slug_unique" UNIQUE("slug");