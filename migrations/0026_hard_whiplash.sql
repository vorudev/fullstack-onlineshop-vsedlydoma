ALTER TABLE "categoryImages" RENAME COLUMN "category_id" TO "related_id";--> statement-breakpoint
ALTER TABLE "product_images" RENAME COLUMN "product_id" TO "related_id";--> statement-breakpoint
ALTER TABLE "categoryImages" DROP CONSTRAINT "categoryImages_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_product_id_products_id_fk";
--> statement-breakpoint
DROP INDEX "idx_category_id";--> statement-breakpoint
DROP INDEX "product_images_product_id_idx";--> statement-breakpoint
ALTER TABLE "categoryImages" ADD CONSTRAINT "categoryImages_related_id_categories_id_fk" FOREIGN KEY ("related_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_related_id_products_id_fk" FOREIGN KEY ("related_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_related_id" ON "categoryImages" USING btree ("related_id");--> statement-breakpoint
CREATE INDEX "product_images_related_id_idx" ON "product_images" USING btree ("related_id");