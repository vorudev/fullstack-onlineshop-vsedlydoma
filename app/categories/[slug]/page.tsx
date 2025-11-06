

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getCategoryWithNavigation, buildCategoryUrl } from '@/lib/actions/categories';
import { getFeaturedCategoryImage } from '@/lib/actions/image-actions';
import Header from '@/components/frontend/header';
import Image from 'next/image';
import Subcat from './subcat';
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  // Шаг 1: Получаем параметры
  const { slug } = await params;
  // const resolvedSearchParams = await searchParams; 

  
  // const selectedFilters: Record<string, string[]> = {};
  // Object.keys(resolvedSearchParams).forEach(key => {
  //   const value = resolvedSearchParams[key];
  //   if (value && key !== 'chain') { 
  //     selectedFilters[key] = Array.isArray(value) ? value : value.split(',');
  //   }
 // });


  // Шаг 2: Получаем категорию (нужна для следующих запросов)
  const data = await getCategoryWithNavigation(slug);
  
  if (!data) {
    notFound();
  }

  const { category, breadcrumbs, subcategories} = data;
  if (subcategories.length === 0) {
    redirect(`/products?category=${category.slug}`);
  }

  // ✅ Шаг 3: ПАРАЛЛЕЛЬНАЯ загрузка зависимых данных
 // const [{products, totalCount, availableManufacturers}, filterCategoriesWithFilters] = await Promise.all([
 //   getFilteredProducts(category.id, selectedFilters, 1, 20),
 //   getFilterCategoriesWithFiltersByProductCategory(category.id),
 // ]);


  return ( <>

    <div className=" xl:max-w-[1550px] lg:max-w-[1000px] flex text-black lg:mx-auto py-2 px-[16px]  lg:py-0 lg:px-0 bg-gray-100">
    {/* <FilterSidebar filterCategories={filterCategoriesWithFilters} avaliableManufacturers={availableManufacturers}/> */}
      <div className="flex lg:p-6 flex-col gap-2 lg:gap-2 w-full py-2 ">

        <nav className=" text-sm text-gray-600">
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
              {index < breadcrumbs.length - 1 && ' / '}
            </span>
          ))}
        </nav>

        <h1 className="lg:text-3xl text-2xl font-bold ">{category.name}</h1>
       

  
        {subcategories.length > 0 ? (
                      <div className="grid grid-cols-1 pt-2 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6 gap-1">
              {subcategories.map((subcat) => (
                <Subcat
                  key={subcat.id}
                  category={subcat}
                />
              ))}
            </div>

        ) : (
         <div className="text-center py-8">
    <p className="text-gray-600 mb-4">Загрузка товаров...</p>
  </div>

        )}
      </div>
              {/* <ProductList products={products} /> */} 
    </div>

    </>
  );
}