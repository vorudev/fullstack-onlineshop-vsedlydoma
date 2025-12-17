'use server';
import Image from "next/image";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ManufacturerForm} from "@/components/forms/create-manufacturert-form";
import { getCategories } from "@/lib/actions/product-categories";
import ManufacturersTable from "@/components/manufacturers-table";
import Pagination  from "@/components/pagination";

import { getAllManufacturers } from "@/lib/actions/manufacturer";
import SearchBar from "@/components/searchbar";
import { get } from "http";
import { Metadata } from "next";
interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;
    category?: string;
  }>;

}
export const metadata: Metadata = {
  title: "Производители",
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
  const { page, search, category } = await searchParams;
  const currentPage = Number(page) || 1;
  const searchQuery = search || '';
  const { manufacturers, pagination } = await getAllManufacturers({
    page: currentPage,
    pageSize: 21,
    search: searchQuery,

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
   
    <SearchBar />
      
      {/* Показываем что ищем */}
      {searchQuery && (
        <p className="mb-4 text-gray-600">
          Результаты поиска: "{searchQuery}" ({pagination.total} найдено)
        </p>
      )}

      <ManufacturersTable manufacturers={manufacturers} />
 <Pagination 
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
      />

    </div>
  );
}
