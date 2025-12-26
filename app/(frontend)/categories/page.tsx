// app/catalog/page.tsx
import { Suspense } from 'react';
import CategorySkeleton from '@/components/frontend/skeletons/category-skeleton';
import CategoriesList from './categories-list';

export default function CatalogPage() {
  return (
    <div className="xl:max-w-[1400px] lg:max-w-[1000px] flex text-black lg:mx-auto py-2 px-[16px] min-h-screen lg:py-0 lg:px-0 bg-gray-100">
      <div className="flex lg:p-6 flex-col gap-2 lg:gap-2 w-full py-2">
        <h1 className="lg:text-3xl text-2xl font-bold">Каталог</h1>
        
        <Suspense 
          fallback={
            <div className="grid grid-cols-1 pt-2 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6 gap-1">
              {Array.from({ length: 10 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </div>
          }
        >
          <CategoriesList />
        </Suspense>
      </div>
    </div>
  );
}