'use server';

import { db } from "@/db/drizzle";
import { categories, Category, filters } from "@/db/schema";
import { eq, ilike, or } from "drizzle-orm";
import { products } from "@/db/schema";
import { isNull } from "drizzle-orm";
import { productAttributes } from "@/db/schema";
import { and, inArray, sql } from "drizzle-orm";
import { create } from "domain";


type CategoryBreadcrumb = {
  id: string;
  name: string;
  slug: string;
};
type ProductWithChain = {
  product: typeof products.$inferSelect;
  categoryChain: CategoryBreadcrumb[];
};
interface FilterParams {
  [filterSlug: string]: string[]; // { "processor": ["f9864ee0-5645-4903-98fc-fafbf93f9252"] }
}
interface CategoryParams { 
  page?: number;
  pageSize?: number;
  search?: string;
}
export async function getFilteredProducts(
  categoryId: string,
  selectedFilters?: FilterParams, // { "processor": ["filter-id-1", "filter-id-2"] }
  page: number = 1,
  limit: number = 20
) {
  try {
    // Если фильтры не выбраны
    if (!selectedFilters || Object.keys(selectedFilters).length === 0) {
      const result = await db
        .select()
        .from(products)
        .where(eq(products.categoryId, categoryId))
        .limit(limit)
        .offset((page - 1) * limit);
      
      return result;
    }

    // Получаем данные выбранных фильтров (slug и name)
    const allFilterIds = Object.values(selectedFilters).flat();
    
    const selectedFilterData = await db
      .select({
        id: filters.id,
        slug: filters.slug,
        name: filters.name
      })
      .from(filters)
      .where(inArray(filters.id, allFilterIds));

    // Группируем по slug: { "processor": ["intel i7", "amd ryzen"], "ram": ["16gb"] }
    const filtersBySlug: Record<string, string[]> = {};
    
    for (const [slug, filterIds] of Object.entries(selectedFilters)) {
      const filterNames = selectedFilterData
        .filter(f => filterIds.includes(f.id))
        .map(f => f.name);
      
      if (filterNames.length > 0) {
        filtersBySlug[slug] = filterNames;
      }
    }

    console.log("Filters by slug:", filtersBySlug);

    // Теперь фильтруем товары
    // product_attributes.name должен совпадать со slug фильтра
    // product_attributes.value должен совпадать с filters.name

    const subquery = db
      .select({ 
        productId: productAttributes.productId,
        filterCount: sql<number>`COUNT(DISTINCT ${productAttributes.name})`.as('filter_count')
      })
      .from(productAttributes)
      .where(
        sql`(${productAttributes.name}, ${productAttributes.value}) IN (${sql.join(
          Object.entries(filtersBySlug).map(([slug, names]) =>
            names.map(name => sql`(${slug}, ${name})`)
          ).flat(),
          sql`, `
        )})`
      )
      .groupBy(productAttributes.productId)
      .having(sql`COUNT(DISTINCT ${productAttributes.name}) = ${Object.keys(filtersBySlug).length}`)
      .as('filtered_products');

    const result = await db
      .select()
      .from(products)
      .innerJoin(subquery, eq(products.id, subquery.productId))
      .where(eq(products.categoryId, categoryId))
      .limit(limit)
      .offset((page - 1) * limit);

    return result.map(r => r.products);

  } catch (error) {
    console.error("Error filtering products:", error);
    throw new Error("Failed to filter products");
  }
}
export async function getRootCategories() {
  return await db
    .select()
    .from(categories)
    .where(isNull(categories.parentId));
}
export async function getSubcategories(parentId: string) {
  return await db
    .select()
    .from(categories)
    .where(eq(categories.parentId, parentId));
}
export async function getCategoryBySlug(slug: string) {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return category;
}

export async function getCategoryChain(
  categoryId: string
): Promise<CategoryBreadcrumb[]> {
  // Получаем цепочку категорий
  const categoryChain: CategoryBreadcrumb[] = [];
  let currentCategoryId: string | null = categoryId;

  // Собираем все категории за один запрос (оптимизация)
  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      parentId: categories.parentId,
    })
    .from(categories);

  // Создаем Map для быстрого поиска
  const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));

  // Строим цепочку
  while (currentCategoryId) {
    const category = categoryMap.get(currentCategoryId);
    if (!category) break;

    categoryChain.unshift({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });

    currentCategoryId = category.parentId;
  }

  return categoryChain;
}
export async function getProductWithCategoryChain(
  productSlug: string
): Promise<ProductWithChain | null> {
  // Параллельное получение продукта и всех категорий
  const [productResult, allCategories] = await Promise.all([
    db
      .select()
      .from(products)
      .where(eq(products.slug, productSlug))
      .limit(1),
    db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        parentId: categories.parentId,
      })
      .from(categories)
  ]);

  const productData = productResult[0];
  
  if (!productData?.categoryId) {
    return null;
  }

  // Создаем Map для O(1) поиска
  const categoryMap = new Map(
    allCategories.map((cat) => [cat.id, cat])
  );

  // Строим цепочку от конечной категории к корневой
  const categoryChain: CategoryBreadcrumb[] = [];
  let currentCategoryId: string | null = productData.categoryId;
  
  // Защита от бесконечного цикла (циклические ссылки)
  const visited = new Set<string>();
  
  while (currentCategoryId && !visited.has(currentCategoryId)) {
    const category = categoryMap.get(currentCategoryId);
    if (!category) break;
    
    visited.add(currentCategoryId);
    categoryChain.unshift({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });
    
    currentCategoryId = category.parentId;
  }

  return {
    product: productData,
    categoryChain,
  };
}

// Альтернатива: если категорий много, но нужны только связанные
export async function getProductWithCategoryChainOptimized(
  productSlug: string
): Promise<ProductWithChain | null> {
  // Сначала получаем продукт
  const [productData] = await db
    .select()
    .from(products)
    .where(eq(products.slug, productSlug))
    .limit(1);

  if (!productData?.categoryId) {
    return null;
  }

  // Рекурсивный CTE для получения только нужных категорий
  // Это эффективнее если у вас тысячи категорий
  const categoryChain = await db.execute(sql`
    WITH RECURSIVE category_path AS (
      -- Базовый случай: начальная категория
      SELECT 
        id, 
        name, 
        slug, 
        parent_id,
        1 as depth
      FROM categories
      WHERE id = ${productData.categoryId}
      
      UNION ALL
      
      -- Рекурсивный случай: родительские категории
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.parent_id,
        cp.depth + 1
      FROM categories c
      INNER JOIN category_path cp ON c.id = cp.parent_id
      WHERE cp.depth < 10  -- защита от бесконечной рекурсии
    )
    SELECT id, name, slug
    FROM category_path
    ORDER BY depth DESC
  `);

  return {
    product: productData,
    categoryChain: categoryChain.rows as CategoryBreadcrumb[],
  };
}

// Вариант с кешированием для часто запрашиваемых продуктов
const categoryChainCache = new Map<string, CategoryBreadcrumb[]>();

export async function getProductWithCategoryChainCached(
  productSlug: string,
  cacheTTL = 5 * 60 * 1000 // 5 минут
): Promise<ProductWithChain | null> {
  const [productData] = await db
    .select()
    .from(products)
    .where(eq(products.slug, productSlug))
    .limit(1);

  if (!productData?.categoryId) {
    return null;
  }

  const cacheKey = `chain:${productData.categoryId}`;
  
  // Проверяем кеш
  let categoryChain = categoryChainCache.get(cacheKey);
  
  if (!categoryChain) {
    // Строим цепочку
    const allCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        parentId: categories.parentId,
      })
      .from(categories);

    const categoryMap = new Map(
      allCategories.map((cat) => [cat.id, cat])
    );

    categoryChain = [];
    let currentCategoryId: string | null = productData.categoryId;
    const visited = new Set<string>();

    while (currentCategoryId && !visited.has(currentCategoryId)) {
      const category = categoryMap.get(currentCategoryId);
      if (!category) break;
      
      visited.add(currentCategoryId);
      categoryChain.unshift({
        id: category.id,
        name: category.name,
        slug: category.slug,
      });
      
      currentCategoryId = category.parentId;
    }

    // Сохраняем в кеш
    categoryChainCache.set(cacheKey, categoryChain);
    
    // Автоочистка кеша
    setTimeout(() => categoryChainCache.delete(cacheKey), cacheTTL);
  }

  return {
    product: productData,
    categoryChain,
  };
}
export async function getCategories() {
    try {
        const allCategories = await db.select().from(categories);
        return allCategories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories");
    }
}
export const getAllCategories = async ({
  page = 1,
  pageSize = 20,
  search = ''
}: CategoryParams = {}) => {
  try {
    const offset = (page - 1) * pageSize;
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(categories.name, `%${search}%`),
          ilike(categories.description, `%${search}%`),
          ilike(categories.slug, `%${search}%`)
        )
      );
    }

    let query = db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description, 
        parentId: categories.parentId, 
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt
      })
      .from(categories)
      .$dynamic();

    let countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .$dynamic();

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }

    const getAllCategories = await query
      .limit(pageSize)
      .offset(offset)
      .orderBy(sql`name ASC`);

    const [{ count }] = await countQuery;

    return {
      categories: getAllCategories,
      pagination: {
        page,
        pageSize,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / pageSize),
      }
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};
export async function createCategory(category: Omit<Category, "id" | "createdAt" | "updatedAt">) {
    try {
        await db.insert(categories).values(category).returning();
    } catch (error) {
        console.error("Error creating category:", error);
        throw new Error("Failed to create category");
    }
}

export async function updateCategory(category: Omit<Category, "createdAt" | "updatedAt">) {
    try {
        await db.update(categories).set(category).where(eq(categories.id, category.id))
    } catch (error) {
        console.error("Error updating category:", error);
        throw new Error("Failed to update category");
    }
}

export async function deleteCategory(id: string) {
    try {
        await db.delete(categories).where(eq(categories.id, id));
    } catch (error) {
        console.error("Error deleting category:", error);
        throw new Error("Failed to delete category");
    }
}

