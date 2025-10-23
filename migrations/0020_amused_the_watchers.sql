ALTER TABLE "products" ADD COLUMN "sku" varchar(16) DEFAULT 'PRD-' || upper(to_hex(floor(random() * 4294967295)::int));--> statement-breakpoint
CREATE INDEX "products_sku_idx" ON "products" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "products_price_idx" ON "products" USING btree ("price");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_sku_unique" UNIQUE("sku");