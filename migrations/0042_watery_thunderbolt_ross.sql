DROP INDEX "orders_customer_name_idx";--> statement-breakpoint
DROP INDEX "orders_customer_email_idx";--> statement-breakpoint
DROP INDEX "orders_customer_phone_idx";--> statement-breakpoint
CREATE INDEX "orders_customer_email_idx" ON "orders" USING btree ("customer_email");--> statement-breakpoint
CREATE INDEX "orders_customer_phone_idx" ON "orders" USING btree ("customer_phone");