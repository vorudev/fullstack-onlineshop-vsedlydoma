CREATE TABLE "manufacturer_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"storage_type" text DEFAULT 'url' NOT NULL,
	"storage_key" text,
	"order" integer DEFAULT 0,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "categoryImages" RENAME COLUMN "related_id" TO "category_id";--> statement-breakpoint
ALTER TABLE "product_images" RENAME COLUMN "related_id" TO "product_id";--> statement-breakpoint
ALTER TABLE "product_attributes" DROP CONSTRAINT "product_attributes_slug_unique";--> statement-breakpoint
ALTER TABLE "categoryImages" DROP CONSTRAINT "categoryImages_related_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_related_id_products_id_fk";
--> statement-breakpoint
DROP INDEX "idx_related_id";--> statement-breakpoint
DROP INDEX "product_images_related_id_idx";--> statement-breakpoint
ALTER TABLE "manufacturer_images" ADD CONSTRAINT "manufacturer_images_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "manufacturer_images_manufacturer_id_idx" ON "manufacturer_images" USING btree ("manufacturer_id");--> statement-breakpoint
ALTER TABLE "categoryImages" ADD CONSTRAINT "categoryImages_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_category_id" ON "categoryImages" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "product_images_product_id_idx" ON "product_images" USING btree ("product_id");