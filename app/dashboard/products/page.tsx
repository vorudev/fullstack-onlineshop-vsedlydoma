import Image from "next/image";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductForm} from "@/components/forms/product-form";
import { getAllCategories } from "@/lib/actions/product-categories";
import ProductsTable from "@/components/products-table";
import { categories } from "@/db/schema";
import Pagination  from "@/components/frontend/pagination-admin";
import { CategoryFilter } from "@/components/category-filter";
import { StatusFilter } from "@/components/status-filter";
import { getAllManufacturers } from "@/lib/actions/manufacturer";
import { getAllProducts } from "@/lib/actions/product";
import { ManufacturerFilter } from "@/components/manufacturer-filter";
import SearchBar from "../../../components/searchbar";
import { Metadata } from "next";
interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;
    category?: string;
    limit: number;
    manufacturer?: string;
    manufacturerPage?: string;
    manufacturerSearch?: string;
    status?: string;
  }>;

}
export const metadata: Metadata = {
  title: "Товары",
  description: "Мы более 10 лет на рынке, проверены временем в мире сантехники и товаров для дома в Минске. Консультации специалистов, доступные цены, большой ассортимент",
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
export default async function Home({ searchParams }: PageProps) {
  const { 
    page, 
    search, 
    category,
    manufacturer,
    status, 
    limit
  } = await searchParams;
  
  const currentPage = Number(page) || 1;
  const limitNumber = Number(limit) || 20;
  const searchQuery = search || '';
  const categoryFilter = category || '';
  const manufacturerFilter = manufacturer || ''; // переименовал переменную!
  const statusFilter = status !== undefined ? false : undefined;

  const [{ categories}, { manufacturers }, { products, pagination }] = 
    await Promise.all([
      getAllCategories({
        page: 1,
        pageSize: 20,
      }),
      getAllManufacturers({
        page: 1,
        pageSize: 20, // без пагинации для фильтра
      }),
      getAllProducts({
        page: currentPage,
        pageSize: limitNumber,
        search: searchQuery,
        category: categoryFilter,
        manufacturer: manufacturerFilter, 
        status: statusFilter
         // используем правильную переменную
      }),
    ]);

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Товары</h1>
      
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Добавить Товар<PlusIcon /></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить Товар</DialogTitle>
              <DialogDescription>
                Добавить новый товар в базу данных
              </DialogDescription>
              <ProductForm categories={categories} manufacturers={manufacturers}/>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Панель фильтров */}
      <div className="flex gap-4 my-4 items-center">
        <SearchBar />
        <CategoryFilter categories={categories} selectedCategory={categoryFilter} />
        <ManufacturerFilter manufacturers={manufacturers} selectedManufacturer={manufacturerFilter} />
        <StatusFilter selectedStatus={statusFilter}/>
      </div>

      {/* Показываем активные фильтры */}
      {(searchQuery || categoryFilter || manufacturerFilter) && (
        <div className="mb-4 text-gray-600">
          {searchQuery && <span>Поиск: "{searchQuery}"</span>}
          {searchQuery && (categoryFilter || manufacturerFilter) && <span className="mx-2">|</span>}
          {categoryFilter && (
            <span>
              Категория: {categories.find(c => c.id === categoryFilter)?.name || categoryFilter}
            </span>
          )}
          {categoryFilter && manufacturerFilter && <span className="mx-2">|</span>}
          {manufacturerFilter && (
            <span>
              Производитель: {manufacturers.find(m => m.id === manufacturerFilter)?.name || manufacturerFilter}
            </span>
          )}
          <span className="ml-2">({pagination.total} найдено)</span>
        </div>
      )}

      <ProductsTable 
        products={products} 
        categories={categories} 
        manufacturers={manufacturers} 
      />
      
      <div className="max-w-[600px] mx-auto"><Pagination 
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={limitNumber}
      /></div>
    </div>
  );
}