CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE INDEX "products_title_trgm_idx" ON "products" USING gin ("title" gin_trgm_ops);--> statement-breakpoint