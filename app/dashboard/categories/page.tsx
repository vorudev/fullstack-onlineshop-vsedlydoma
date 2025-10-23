import Image from "next/image";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import SearchBar from "@/components/searchbar";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryForm } from "@/components/forms/category-form";
import CategoriesTable from "@/components/categories-table";
import { getAllCategories } from "@/lib/actions/product-categories";

interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;
  }>;

}
export default async function Home( { searchParams }: PageProps) {
  const { page, search } = await searchParams;
  const currentPage = Number(page) || 1;
  const searchQuery = search || '';
const { categories, pagination } = await getAllCategories(
  {
     page: currentPage,
    pageSize: 21,
    search: searchQuery,
  }
); // Fetch categories
  return (
     <div className=" w-full p-4 ">

      <h1 className="text-2xl font-bold mb-4">Категории Товаров</h1> 
      <div className="flex justify-end">
      <Dialog>
  <DialogTrigger asChild><Button>Добавить Категорию<PlusIcon /></Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Добавить Категорию</DialogTitle>
      <CategoryForm categories={categories}  />
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
    <h1>Поиск по главным категориям</h1>
    <SearchBar />
  {searchQuery && (
        <p className="mb-4 text-gray-600">
          Результаты поиска: "{searchQuery}" ({pagination.total} найдено)
        </p>
      )}
      <CategoriesTable categories={categories} />
       <Pagination 
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
            />
    </div>
  );
}
