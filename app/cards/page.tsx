// app/catalog/[category]/page.tsx

import { getFiltersByCategory } from "@/lib/actions/filters";
import { getFilteredProducts } from "@/lib/actions/product-categories";
import FilterSidebar from "../categories/[slug]/filtersidebar";
import CategoriesTable from "@/components/categories-table-user";
import { getCategories } from "@/lib/actions/product-categories";


interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CatalogPage({ params, searchParams }: PageProps) {
  const categoryId = "36c1eb18-b8db-46de-8d52-7529cc56ab47";
  const filterCategoryId = "86a44c1c-b784-49e2-a2c4-71784f0c4bd2";
  const categories = await getCategories();
  // Парсим фильтры из URL
  const selectedFilters: Record<string, string[]> = {};
  
  Object.keys(searchParams).forEach(key => {
    const value = searchParams[key];
    if (value) {
      selectedFilters[key] = Array.isArray(value) ? value : [value];
    }
  });

  console.log("Selected filters from URL:", selectedFilters);

  // Получаем отфильтрованные продукты
  const result = await getFilteredProducts(categoryId, selectedFilters);
  
  // Получаем доступные фильтры
  const filters = await getFiltersByCategory(filterCategoryId);

  console.log("Filtered products:", result);

  return (
    <div className="flex">
      {/* Боковая панель с фильтрами - клиентский компонент */}
      <CategoriesTable categories={categories}/>
      {/* Сетка товаров */}
    
    </div>
  );
}