CREATE TABLE "attribute_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"display_order" integer DEFAULT 0,
	CONSTRAINT "attribute_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "product_attributes" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_category_id_attribute_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."attribute_categories"("id") ON DELETE cascade ON UPDATE no action;