DROP INDEX "orders_status_created_idx";--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "orders_created_status_idx" ON "orders" USING btree ("created_at" DESC NULLS LAST,"status");--> statement-breakpoint
CREATE INDEX "orders_customer_name_idx" ON "orders" USING gin ("customer_name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "orders_customer_email_idx" ON "orders" USING gin ("customer_email" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "orders_customer_phone_idx" ON "orders" USING gin ("customer_phone" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "orders_status_created_idx" ON "orders" USING btree ("status","created_at" DESC NULLS LAST);