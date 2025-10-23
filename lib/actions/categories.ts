import { db } from "@/db/drizzle";
import { categories, products } from "@/db/schema";
import { eq, isNull, sql } from "drizzle-orm";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  productsCount: number;
  hasChildren: boolean;
};

export type CategoryWithChain = {
  category: Category;
  breadcrumbs: Array<{ id: string; name: string; slug: string }>;
  subcategories: Category[];
  products?: Array<typeof products.$inferSelect>;
};

// Получить категорию со всей информацией
export async function getCategoryWithNavigation(
  categorySlug: string
): Promise<CategoryWithChain | null> {
  // Получаем текущую категорию
  const [currentCategory] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .limit(1);

  if (!currentCategory) return null;

  // Получаем breadcrumbs (цепочку родителей)
  const breadcrumbs = await buildCategoryChain(currentCategory.id);

  // Получаем подкатегории с количеством продуктов
  const subcategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      parentId: categories.parentId,
      productsCount: sql<number>`(
        SELECT COUNT(*)::int 
        FROM ${products} 
        WHERE ${products.categoryId} = ${categories.id}
      )`,
      hasChildren: sql<boolean>`EXISTS(
        SELECT 1 
        FROM ${categories} c 
        WHERE c.parent_id = ${categories.id}
      )`,
    })
    .from(categories)
    .where(eq(categories.parentId, currentCategory.id));

  // Если нет подкатегорий, получаем продукты
  let categoryProducts: typeof products.$inferSelect[] | undefined = undefined;
  if (subcategories.length === 0) {
    categoryProducts = await db
      .select()
      .from(products)
      .where(eq(products.categoryId, currentCategory.id));
  }

  return {
    category: {
      ...currentCategory,
      productsCount: categoryProducts?.length || 0,
      hasChildren: subcategories.length > 0,
    },
    breadcrumbs,
    subcategories,
    products: categoryProducts,
  };
}

// Получить корневые категории
export async function getRootCategories(): Promise<Category[]> {
  const rootCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      parentId: categories.parentId,
      productsCount: sql<number>`(
        WITH RECURSIVE subcats AS (
          SELECT id FROM ${categories} WHERE id = ${categories.id}
          UNION ALL
          SELECT c.id FROM ${categories} c
          INNER JOIN subcats s ON c.parent_id = s.id
        )
        SELECT COUNT(*)::int FROM ${products}
        WHERE category_id IN (SELECT id FROM subcats)
      )`,
      hasChildren: sql<boolean>`EXISTS(
        SELECT 1 FROM ${categories} c WHERE c.parent_id = ${categories.id}
      )`,
    })
    .from(categories)
    .where(isNull(categories.parentId));

  return rootCategories;
}

// Построить цепочку категорий (breadcrumbs)
async function buildCategoryChain(categoryId: string) {
  const chain: Array<{ id: string; name: string; slug: string }> = [];
  let currentId: string | null = categoryId;

  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      parentId: categories.parentId,
    })
    .from(categories);

  const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));

  while (currentId) {
    const category = categoryMap.get(currentId);
    if (!category) break;

    chain.unshift({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });

    currentId = category.parentId;
  }

  return chain;
}

// Получить путь категории для построения URL с search params
export function buildCategoryPath(breadcrumbs: Array<{ slug: string }>) {
  return breadcrumbs.map((b) => b.slug).join(",");
}


export function buildCategoryUrl(
  currentSlug: string,
  breadcrumbs: Array<{ slug: string }>
) {
  const path = buildCategoryPath(breadcrumbs);
  return `/categories/${currentSlug}?chain=${encodeURIComponent(path)}`;
}