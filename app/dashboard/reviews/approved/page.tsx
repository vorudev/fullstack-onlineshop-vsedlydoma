import { ApprovedReviewsTable } from "@/components/approved-reviews-table"
import { getAllApprovedReviews } from "@/lib/actions/reviews"
import Pagination  from "@/components/pagination"
import SearchBar from "@/components/searchbar"
interface PageProps {
    searchParams: Promise<{ // Добавляем Promise
        page?: string;
        search?: string;
       
      }>;
}
 export default async function ReviewsTablePage({ searchParams }: PageProps) { 
    const { page, search } = await searchParams;
    const currentPage = Number(page) || 1;
  const searchQuery = search || '';
    const [{ allReviews, pagination }] = await Promise.all([
      getAllApprovedReviews({
        page: currentPage,
        pageSize: 21,
        search: searchQuery,
      }),
    ]);
    return ( 

            <main>
               <div className="px-4 py-2"><SearchBar /></div>
            <ApprovedReviewsTable reviews={allReviews} />
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                  />
            </main>

    )
}