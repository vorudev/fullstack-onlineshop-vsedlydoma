ALTER TABLE "attribute_categories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "attribute_categories" CASCADE;--> statement-breakpoint
ALTER TABLE "product_attributes" DROP CONSTRAINT "product_attributes_category_id_attribute_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "product_attributes" DROP COLUMN "category_id";