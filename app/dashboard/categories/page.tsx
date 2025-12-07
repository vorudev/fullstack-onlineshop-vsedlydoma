import Image from "next/image";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import SearchBar from "@/components/searchbar";
import Pagination from "@/components/frontend/pagination-admin";

import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryForm } from "@/components/forms/category-form";
import { CategoriesTable } from "@/components/categories-table-admin";
import { getAllCategories } from "@/lib/actions/product-categories";

interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;
    limit?: string;
  }>;

}
export default async function Home( { searchParams }: PageProps) {
  const { page, search, limit } = await searchParams;
  const currentPage = Number(page) || 1;
  const limitNumber = Number(limit) || 21;
  const searchQuery = search || '';
const { categories, pagination } = await getAllCategories(
  {
     page: currentPage,
    pageSize: limitNumber,
    search: searchQuery,
  }
); // Fetch categories
  return (
     <div className=" w-full p-4 ">

    
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
    
  {searchQuery && (
        <p className="mb-4 text-gray-600">
          Результаты поиска: "{searchQuery}" ({pagination.total} найдено)
        </p>
      )}
      <CategoriesTable categories={categories} />
      <div className="mt-4 text-black max-w-[600px] mx-auto">  <Pagination 
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={limitNumber}
            /></div>
    </div>
  );
}
