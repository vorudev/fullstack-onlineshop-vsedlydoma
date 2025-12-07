import { ReviewModerationTable } from "@/components/approved-reviews-table"
import { getAllPendingReviews } from "@/lib/actions/reviews"
import Pagination  from "@/components/pagination"
import SearchBar from "@/components/searchbar"

 interface PageProps {
  searchParams: Promise<{ // Добавляем Promise
    page?: string;
    search?: string;
    limit: number;
    rating?: number;
    date?: 'newest' | 'oldest';
  }>;

}
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
      status: 'approved'
    });
  
    return ( 

            <main>
            <ReviewModerationTable  reviews={reviewsWithUserInfo} />
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                  />
            </main>

    )
}