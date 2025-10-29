CREATE INDEX "slug_index" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "name_index" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_parent_id" ON "categories" USING btree ("parent_id");