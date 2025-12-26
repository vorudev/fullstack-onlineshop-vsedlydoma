
import ProfilePage from "./client"
import { Auth } from "better-auth";
import {headers} from "next/headers"
import {TwoFactorAuthForm} from "@/components/forms/auth/two-factor-form"
import {getUserOrders} from "@/lib/actions/orders"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ProfileSkeleton from "@/components/frontend/skeletons/profile-skeleton";
import { Suspense } from "react";
export const metadata: Metadata = {
    title: "Личный кабинет",
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
interface PageProps {
    searchParams: Promise<{ // Добавляем Promise
        page?: string;
        search?: string;
        status?: string;
      }>;
}
export default async function Profile({ searchParams }: PageProps) {
    const session = await auth.api.getSession({
      headers: await headers()
    });
  
    if (session === null) {
      redirect("/signin");
    }
  
    return (
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent searchParams={searchParams} session={session} />
      </Suspense>
    );
  }

  async function ProfileContent({ 
    searchParams, 
    session 
  }: { 
    searchParams: Promise<{ page?: string; search?: string; status?: string }>;
    session: any;
  }) {
    const { page, search, status } = await searchParams;
    
    const currentPage = Number(page) || 1;
    const searchQuery = search || '';
    
    const { orders, pagination } = await getUserOrders({
      page: currentPage,
      pageSize: 10,
      search: searchQuery,
      status: status,
    });
  
    return ( <div className="bg-white"><ProfilePage orders={orders} pagination={pagination} session={session} /> </div> );
  }