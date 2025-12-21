'use server';
import Image from "next/image";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusFilter } from "@/components/status-filter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ManufacturerForm} from "@/components/forms/create-manufacturert-form";
import { getCategories } from "@/lib/actions/product-categories";
import ManufacturersTable from "@/components/manufacturers-table";
import Pagination  from "@/components/frontend/pagination-admin";

import { getAllManufacturers } from "@/lib/actions/manufacturer";
import SearchBar from "@/components/searchbar";
import { get } from "http";
import { Metadata } from "next";
interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;
    category?: string;
    limit: number;
    status?: string;
  }>;

}

export default async function Home({ searchParams }: PageProps) {
  const { page, search, category, limit, status} = await searchParams;
  const limitNumber = Number(limit) || 20;
  const currentPage = Number(page) || 1;
  const statusFilter = status !== undefined ? false : undefined;
  const searchQuery = search || '';
  const { manufacturers, pagination } = await getAllManufacturers({
    page: currentPage,
    pageSize: limitNumber,
    search: searchQuery,
    status: statusFilter,

  });
  return (
     <div className=" w-full  p-4  ">

      <h1 className="text-2xl font-bold mb-4">Производители</h1> 
      <div className="flex justify-end ">
      <Dialog>
  <DialogTrigger asChild><Button>Добавить Производителя<PlusIcon /></Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Добавить Производителя</DialogTitle>

      <ManufacturerForm />
    </DialogHeader>
  </DialogContent>
</Dialog>
 
    </div>
   
 <div className="flex flex-row items-center gap-5">   <SearchBar />
      <StatusFilter selectedStatus={statusFilter}/>
      </div>
      {/* Показываем что ищем */}
      {searchQuery && (
        <p className="mb-4 text-gray-600">
          Результаты поиска: "{searchQuery}" ({pagination.total} найдено)
        </p>
      )}

      <ManufacturersTable manufacturers={manufacturers} />
 <div className="max-w-[600px] mx-auto"><Pagination 
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={limitNumber}
      /></div>

    </div>
  );
}
