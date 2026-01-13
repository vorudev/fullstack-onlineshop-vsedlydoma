import { db } from "@/db/drizzle";
import { and, eq, ilike, sql, or, inArray, gte, lte } from "drizzle-orm";
import { rateLimitbyIp } from "@/lib/actions/limiter";
import { productAttributes, products } from "@/db/schema";

export async function POST(request: Request) { 
    const { 
        filtersBySlug,
        categoryId, 
        priceFrom,
        priceTo
    }: { 
        filtersBySlug: Record<string, string[]>;
categoryId: string;
        priceFrom: number | undefined;
        priceTo: number | undefined;
    } = await request.json();
    
    await rateLimitbyIp(150, 60000);
    
    // Базовые условия поиска
    const whereConditions = buildWhereConditions({
        categoryId,
        priceFrom,
        priceTo
    });
    
    // Добавляем фильтры по атрибутам
    if (Object.keys(filtersBySlug).length > 0) {
        const attributeFilter = buildAttributeFilter(filtersBySlug, categoryId);
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
    categoryId, 
    priceFrom, 
    priceTo 
}: {
    categoryId: string;
    priceFrom: number | undefined;
    priceTo: number | undefined;
}) {
    const conditions = [];
    
    // Товар должен быть активным
    conditions.push(eq(products.isActive, true));
    

    if (categoryId.length > 0) {
        conditions.push(eq(products.categoryId, categoryId));
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
    categoryId: string
) {
    // Получаем ID товаров из нужных категорий
    const categoryProductIds = db
        .select({ id: products.id })
        .from(products)
        .where(
            and(
                eq(products.isActive, true),
                eq(products.categoryId, categoryId)
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