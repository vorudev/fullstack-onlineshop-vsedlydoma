 import {  ReviewModerationTable} from "@/components/pending-reviews-table";
 import { getAllPendingReviews } from "@/lib/actions/reviews";
 import Pagination from "@/components/frontend/pagination-admin";
import { Metadata } from "next";
 interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;
    limit: number;
    rating?: number;
    date?: 'newest' | 'oldest';

  }>;
  

}
export const metadata: Metadata = {
  title: "Отзывы на рассмотрении",
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
 export default async function ReviewsTablePage({searchParams}: PageProps) { 
    const { page, limit, rating, date, search } = await searchParams;
      const currentPage = Number(page) || 1;
  const limitNumber = Number(limit) || 20;
    const {reviewsWithUserInfo, pagination} = await getAllPendingReviews({
      page: currentPage,
      search: search || '',
      pageSize: limitNumber,
      rating: rating || 0,
      date: date || 'newest',
      status: 'pending', 
    });
  
    return ( 

           <main className="p-4"> 
           <ReviewModerationTable reviews={reviewsWithUserInfo} /> 
           <div className="mt-4 max-w-[600px] mx-auto"><Pagination currentPage={pagination.page} totalPages={pagination.totalPages} total={pagination.total} limit={limitNumber}/></div>
           </main>

    )
}