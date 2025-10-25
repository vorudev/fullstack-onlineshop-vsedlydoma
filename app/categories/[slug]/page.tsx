

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryWithNavigation, buildCategoryUrl } from '@/lib/actions/categories';
import { getFilterCategoriesByProductCategory } from '@/lib/actions/filter-categories';
import { getFilteredProducts } from '@/lib/actions/product-categories';
import { getFiltersByCategories } from '@/lib/actions/filters';
import { getFilterCategoriesWithFiltersByProductCategory } from '@/lib/actions/filter-categories';
import { getFiltersByCategory } from '@/lib/actions/filters';
import { getCategoryChain } from '@/lib/actions/product-categories';
import FilterSidebar from './filtersidebar';
import ProductList from './sort';
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  // Шаг 1: Получаем параметры
  const { slug } = await params;
  const resolvedSearchParams = await searchParams; 
  
  const selectedFilters: Record<string, string[]> = {};
  Object.keys(resolvedSearchParams).forEach(key => {
    const value = resolvedSearchParams[key];
    if (value && key !== 'chain') { 
      selectedFilters[key] = Array.isArray(value) ? value : value.split(',');
    }
  });
  const selectedPriceRange = {
    min: Number(resolvedSearchParams.price_min) || 0,
    max: Number(resolvedSearchParams.price_max) || 10000
  };

  // Шаг 2: Получаем категорию (нужна для следующих запросов)
  const data = await getCategoryWithNavigation(slug);
  
  if (!data) {
    notFound();
  }

  const { category, breadcrumbs, subcategories} = data;

  // ✅ Шаг 3: ПАРАЛЛЕЛЬНАЯ загрузка зависимых данных
  const [{products, totalCount, availableManufacturers}, filterCategoriesWithFilters] = await Promise.all([
    getFilteredProducts(category.id, selectedFilters, 1, 20),
    getFilterCategoriesWithFiltersByProductCategory(category.id),
  ]);


  return (
    <div className="p-6 flex">
      <FilterSidebar filterCategories={filterCategoriesWithFilters} avaliableManufacturers={availableManufacturers}/>
      <div className="flex-1 ml-6">

        <nav className="mb-6 text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.id}>
              <Link 
                href={buildCategoryUrl(
                  crumb.slug,
                  breadcrumbs.slice(0, index + 1)
                )}
                className="hover:text-blue-600"
              >
                {crumb.name}
              </Link>
              {index < breadcrumbs.length - 1 && ' > '}
            </span>
          ))}
        </nav>

        <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
        {category.description && (
          <p className="mb-6 text-gray-700">{category.description}</p>
        )}

        {/* Подкатегории */}
        {subcategories.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Подкатегории</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subcategories.map((subcat) => (
                <Link
                  key={subcat.id}
                  href={buildCategoryUrl(subcat.slug, [
                    ...breadcrumbs,
                    { slug: subcat.slug },
                  ])}
                  className="card p-4 border rounded hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-lg">{subcat.name}</h3>
                  <p className="text-gray-600">
                    {subcat.productsCount} товаров
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Продукты */
          <ProductList products={products} />
        )}
      </div>
    </div>
  );
}