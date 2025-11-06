CREATE TABLE "categoryImages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"image_url" text NOT NULL,
	"storage_type" text DEFAULT 'url' NOT NULL,
	"storage_key" text,
	"order" integer DEFAULT 0,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "categoryImages" ADD CONSTRAINT "categoryImages_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_category_id" ON "categoryImages" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_order" ON "categoryImages" USING btree ("order");--> statement-breakpoint
CREATE INDEX "idx_is_featured" ON "categoryImages" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "attribute_categories_slug_idx" ON "attribute_categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "attribute_categories_name_idx" ON "attribute_categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "manufacturers_slug_idx" ON "manufacturers" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "manufacturers_name_idx" ON "manufacturers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "order_items_product_id_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_attributes_slug_idx" ON "product_attributes" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "product_attributes_name_idx" ON "product_attributes" USING btree ("name");--> statement-breakpoint
CREATE INDEX "product_images_product_id_idx" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "reviews_idx" ON "reviews" USING btree ("product_id","user_id");--> statement-breakpoint
CREATE INDEX "reviews_product_idx" ON "reviews" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "reviews_user_idx" ON "reviews" USING btree ("user_id");