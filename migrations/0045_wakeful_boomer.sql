CREATE TABLE "filtersCategories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"display_order" integer DEFAULT 0,
	"product_category" uuid
);
--> statement-breakpoint
ALTER TABLE "filters" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "filtersCategories" ADD CONSTRAINT "filtersCategories_product_category_categories_id_fk" FOREIGN KEY ("product_category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "filters" ADD CONSTRAINT "filters_category_id_filtersCategories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."filtersCategories"("id") ON DELETE no action ON UPDATE no action;