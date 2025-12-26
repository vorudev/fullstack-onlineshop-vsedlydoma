import { getAllManufacturers } from "@/lib/actions/manufacturer";
import ManufacturersTable from "@/components/manufacturers-table";
import Pagination from "@/components/pagination";
import Category from "./manufacturer";
import SearchBar from "@/components/frontend/searchbar-manufacturers";
import { Suspense } from "react";
import { Metadata } from "next";
interface ManufacturersPageProps {
    searchParams: Promise<{ 
        page?: string;
        pageSize?: string;
        search?: string;
    }>;
}
export const metadata: Metadata = {
    title: "Производители",
    description: "Производители товаров, проверены временем в мире сантехники и товаров для дома в Минске. Консультации специалистов, доступные цены, большой ассортимент",
    keywords: "санхника, строительные материалы, сантехнические услуги, Минск, ремонт, консультации, товары для дома, сантехника минск, строительные материалы минск, сантехнические услуги минск, товары для дома минск",
    robots: { 
      index: true,
      follow: true, 
      nocache: false,
      googleBot: { 
          index: true, 
          follow: true, 
          "max-snippet": -1, 
          "max-image-preview": "large",
          "max-video-preview": "large"
      }
  }
  };
export default async function ManufacturersPage({searchParams}: ManufacturersPageProps) {
    const searchParamsData = await searchParams;
    const search = searchParamsData.search || '';
    const page = parseInt(searchParamsData.page || '1');
    const pageSize = parseInt(searchParamsData.pageSize || '20');
    const {manufacturers, pagination} = await getAllManufacturers(
        {
            page,
            pageSize,
            search
        }
    );
    return (
        <div className="bg-gray-100 ">
               
            <Suspense fallback={<div>Loading...</div>}>
                <div className=" xl:max-w-[1400px] lg:max-w-[1000px] flex flex-col text-black lg:mx-auto py-2 px-[16px] min-h-screen  lg:py-0 lg:px-0 bg-gray-100">
                  
                  <div className="flex lg:p-6 flex-col gap-2 lg:gap-2 w-full py-2 ">
            
                    
            
                   <div className="flex items-center gap-2  justify-between">
                    <h1 className="lg:text-3xl text-2xl font-bold ">Производители</h1>
                    
                    </div>
                    <SearchBar />
              
                    {manufacturers.length > 0 ? (
                                  <div className="grid grid-cols-1 pt-2 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6 gap-1">
                          {manufacturers.map((manufacturer) => (
                            <Category
                              key={manufacturer.id}
                              manufacturer={manufacturer}
                            />
                          ))}
                        </div>
            
                    ) : (
                     <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Загрузка товаров...</p>
              </div>
            
                    )}
                  </div>
                   <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} total={pagination.total} />
                </div>
            </Suspense>
           
        </div>
    );
}
