import { db } from "@/db/drizzle";
import { categories, products } from "@/db/schema";
import { eq, isNull, sql, and, inArray } from "drizzle-orm";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  hasChildren: boolean;
};

export type CategoryWithChain = {
  category: Omit<Category, "productsCount"> ;
  breadcrumbs: Array<{ id: string; name: string; slug: string }>;
  subcategories: Category[];
};

// Получить категорию со всей информацией
export async function getCategoryWithNavigation(
  categorySlug: string
): Promise<CategoryWithChain | null> {
  // Получаем категорию
  const [currentCategory] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .limit(1);

  if (!currentCategory) return null;

  // Параллельно получаем breadcrumbs и подкатегории
  const [breadcrumbs, subcategoriesData] = await Promise.all([
    buildCategoryChain(currentCategory.id),
    // Используем один запрос с JOIN вместо подзапросов
    db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        parentId: categories.parentId,
      })
      .from(categories)
      .where(eq(categories.parentId, currentCategory.id))
      .groupBy(categories.id),
  ]);

  // Проверяем наличие детей одним запросом
  const childrenCheck = await db
    .select({ id: categories.id })
    .from(categories)
    .where(
      inArray(
        categories.parentId,
        subcategoriesData.map((s) => s.id)
      )
    )
    .limit(1);

  const subcategories = subcategoriesData.map((sub) => ({
    ...sub,
    hasChildren: childrenCheck.length > 0,
  }));



  return {
    category: {
      ...currentCategory,
      hasChildren: subcategories.length > 0,
    },
    breadcrumbs,
    subcategories,
  };
}

// Получить корневые категории
export async function getRootCategories(): Promise<Category[]> {
  const result = await db.execute<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    hasChildren: boolean;
  }>(sql`
    WITH RECURSIVE category_tree AS (
      -- Начинаем с корневых категорий
      SELECT id, id as root_id
      FROM ${categories}
      WHERE parent_id IS NULL
      
      UNION ALL
      
      -- Рекурсивно добавляем все подкатегории
      SELECT c.id, ct.root_id
      FROM ${categories} c
      INNER JOIN category_tree ct ON c.parent_id = ct.id
    )
    SELECT 
      c.id,
      c.name,
      c.slug,
      c.description,
      c.parent_id,
      EXISTS(
        SELECT 1 FROM ${categories} child 
        WHERE child.parent_id = c.id
      ) as has_children
    FROM ${categories} c
    LEFT JOIN category_tree ct ON c.id = ct.root_id
    WHERE c.parent_id IS NULL
    GROUP BY c.id, c.name, c.slug, c.description, c.parent_id, ct.root_id
    ORDER BY c.name
  `);

  return result.rows;
}

// Построить цепочку категорий (breadcrumbs)
async function buildCategoryChain(categoryId: string) {
  const result = await db.execute<{ id: string; name: string; slug: string }>(sql`
    WITH RECURSIVE category_path AS (
      SELECT id, name, slug, parent_id, 1 as level
      FROM ${categories}
      WHERE id = ${categoryId}
      
      UNION ALL
      
      SELECT c.id, c.name, c.slug, c.parent_id, cp.level + 1
      FROM ${categories} c
      INNER JOIN category_path cp ON c.id = cp.parent_id
    )
    SELECT id, name, slug
    FROM category_path
    ORDER BY level DESC
  `);
  
  return result.rows;
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