ALTER TABLE "filtersCategories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "filtersCategories" CASCADE;--> statement-breakpoint
ALTER TABLE "filters" DROP CONSTRAINT "filters_category_id_filtersCategories_id_fk";
--> statement-breakpoint
ALTER TABLE "filters" DROP COLUMN "category_id";