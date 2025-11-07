import { getRootCategories } from '@/lib/actions/categories';
import Link from 'next/link';
import Category from './category';
export default async function CatalogPage() {
  const rootCategories = await getRootCategories();

  return (
    <>

    <div className=" xl:max-w-[1400px] lg:max-w-[1000px] flex text-black lg:mx-auto py-2 px-[16px] min-h-screen  lg:py-0 lg:px-0 bg-gray-100">
      
      <div className="flex lg:p-6 flex-col gap-2 lg:gap-2 w-full py-2 ">

        

        <h1 className="lg:text-3xl text-2xl font-bold ">Каталог</h1>
       
  
        {rootCategories.length > 0 ? (
                      <div className="grid grid-cols-1 pt-2 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6 gap-1">
              {rootCategories.map((subcat) => (
                <Category
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
    </div>

    </>
  );
}