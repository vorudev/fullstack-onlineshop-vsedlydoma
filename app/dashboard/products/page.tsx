import Image from "next/image";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductForm} from "@/components/forms/product-form";
import { getAllCategories } from "@/lib/actions/product-categories";
import ProductsTable from "@/components/products-table";
import { categories } from "@/db/schema";
import Pagination  from "@/components/pagination";
import { CategoryFilter } from "@/components/category-filter";
import { getAllManufacturers } from "@/lib/actions/manufacturer";
import { getAllProducts } from "@/lib/actions/product";
import { ManufacturerFilter } from "@/components/manufacturer-filter";
import { getAttributeCategories } from "@/lib/actions/attributes-categories";
import SearchBar from "../../../components/searchbar";
interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;
    category?: string;
    manufacturer?: string;
    manufacturerPage?: string;
    manufacturerSearch?: string;
  }>;

}
export default async function Home({ searchParams }: PageProps) {
  const { 
    page, 
    search, 
    category,
    manufacturer, // фильтр по производителю (переименовал!)
  } = await searchParams;
  
  const currentPage = Number(page) || 1;
  const searchQuery = search || '';
  const categoryFilter = category || '';
  const manufacturerFilter = manufacturer || ''; // переименовал переменную!
  
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
        pageSize: 21,
        search: searchQuery,
        category: categoryFilter,
        manufacturer: manufacturerFilter // используем правильную переменную
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
      
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
      />
    </div>
  );
}