import { db } from "@/db/drizzle";
import { and, eq, ilike, sql, or, inArray, gte, lte } from "drizzle-orm";
import { rateLimitbyIp } from "@/lib/actions/limiter";
import { productAttributes, products } from "@/db/schema";

export async function POST(request: Request) { 
    const { 
        filtersBySlug,
        categoryIds, 
        query, 
        priceFrom,
        priceTo
    }: { 
        filtersBySlug: Record<string, string[]>;
        categoryIds: string[];
        query: string;
        priceFrom: number | undefined;
        priceTo: number | undefined;
    } = await request.json();
    
    await rateLimitbyIp(150, 60000);
    
    // Базовые условия поиска
    const whereConditions = buildWhereConditions({
        query,
        categoryIds,
        priceFrom,
        priceTo
    });
    
    // Добавляем фильтры по атрибутам
    if (Object.keys(filtersBySlug).length > 0) {
        const attributeFilter = buildAttributeFilter(filtersBySlug, categoryIds);
        whereConditions.push(attributeFilter);
    }
    
    // Получаем количество товаров
    const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(and(...whereConditions));

    return Response.json({ count: totalCount[0].count });
}

// Построение базовых условий WHERE
function buildWhereConditions({ 
    query, 
    categoryIds, 
    priceFrom, 
    priceTo 
}: {
    query: string;
    categoryIds: string[];
    priceFrom: number | undefined;
    priceTo: number | undefined;
}) {
    const conditions = [];
    
    // Товар должен быть активным
    conditions.push(eq(products.isActive, true));
    
    // Поиск по тексту
    const textSearch = or(
        sql`similarity(${products.title}, ${query}) > 0.1`,
        sql`similarity(${products.description}, ${query}) > 0.1`,
        ilike(products.sku, `%${query}%`)
    );
    conditions.push(textSearch);
    
    // Фильтр по категориям
    if (categoryIds.length > 0) {
        conditions.push(inArray(products.categoryId, categoryIds));
    }
    
    // Фильтр по цене
    if (priceFrom !== undefined) {
        conditions.push(gte(products.priceRegional, priceFrom));
    }
    
    if (priceTo !== undefined) {
        conditions.push(lte(products.priceRegional, priceTo));
    }
    
    return conditions;
}

// Построение фильтра по атрибутам
function buildAttributeFilter(
    filtersBySlug: Record<string, string[]>, 
    categoryIds: string[]
) {
    // Получаем ID товаров из нужных категорий
    const categoryProductIds = db
        .select({ id: products.id })
        .from(products)
        .where(
            and(
                eq(products.isActive, true),
                inArray(products.categoryId, categoryIds)
            )
        );
    
    // Создаем пары (slug, value) для фильтрации
    const attributePairs = Object.entries(filtersBySlug).flatMap(
        ([slug, values]) => values.map(value => sql`(${slug}, ${value})`)
    );
    
    // Подзапрос: товары, у которых есть ВСЕ нужные атрибуты
    const subquery = db
        .select({ 
            productId: productAttributes.productId,
            filterCount: sql<number>`COUNT(DISTINCT ${productAttributes.slug})`.as('filter_count')
        })
        .from(productAttributes)
        .where(
            and(
                inArray(productAttributes.productId, categoryProductIds),
                sql`(${productAttributes.slug}, ${productAttributes.value}) IN (${sql.join(attributePairs, sql`, `)})`
            )
        )
        .groupBy(productAttributes.productId)
        .having(
            sql`COUNT(DISTINCT ${productAttributes.slug}) = ${Object.keys(filtersBySlug).length}`
        )
        .as('filtered_products');
    
    return inArray(
        products.id, 
        db.select({ id: subquery.productId }).from(subquery)
    );
}