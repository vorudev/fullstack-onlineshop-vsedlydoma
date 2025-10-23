CREATE TABLE "filtersCategories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"display_order" integer DEFAULT 0,
	CONSTRAINT "filtersCategories_name_unique" UNIQUE("name"),
	CONSTRAINT "filtersCategories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "filters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"display_order" integer DEFAULT 0,
	"category_id" uuid
);
--> statement-breakpoint
ALTER TABLE "filters" ADD CONSTRAINT "filters_category_id_filtersCategories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."filtersCategories"("id") ON DELETE no action ON UPDATE no action;