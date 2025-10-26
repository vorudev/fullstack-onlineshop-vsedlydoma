ALTER TABLE "product_attributes" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "storage_type" text DEFAULT 'url' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "storage_key" text;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_slug_unique" UNIQUE("slug");