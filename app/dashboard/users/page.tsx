import { authClient } from "@/lib/auth-client";
import { GetAllUsers } from "@/components/users-table";
import  DashboardPage from "./change-user";


import type { User }  from "@/db/schema";
import Pagination  from "@/components/pagination";
import SearchBar from "../../../components/searchbar";
import { getAllUsers } from "@/lib/actions/admin";
import { Metadata } from "next";
interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;
    category?: string;
  }>;

}
export const metadata: Metadata = {
  title: "Пользователи",
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
export default async function UsersPage({ searchParams }: PageProps) {
   const { page, search} = await searchParams;
   const currentPage = Number(page) || 1;
  const searchQuery = search || '';
  const { users, pagination } = await getAllUsers({
    page: currentPage,
    pageSize: 20,
    search: searchQuery,

  })
  

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Пользователи</h1>
                <SearchBar />
           <GetAllUsers  users={users}/>
 <Pagination 
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
      />
        </div>
    );
 } 