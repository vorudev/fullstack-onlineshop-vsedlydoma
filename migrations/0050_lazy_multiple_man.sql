DROP INDEX "product_attributes_slug_idx";--> statement-breakpoint
DROP INDEX "product_attributes_name_idx";--> statement-breakpoint
CREATE INDEX "product_attributes_slug_value_idx" ON "product_attributes" USING btree ("slug","value");--> statement-breakpoint
CREATE INDEX "product_attributes_product_slug_idx" ON "product_attributes" USING btree ("product_id","slug");--> statement-breakpoint
CREATE INDEX "product_attributes_product_slug_value_idx" ON "product_attributes" USING btree ("product_id","slug","value");