import AdminStats from "@/components/stats/stats-client";
import AdminStatsSkeleton from "@/components/stats/stats-skeleton";
import { Suspense } from "react";
import { getMonthlyOrderStats } from "@/lib/actions/orders";
import CategoriesStats from "@/components/stats/category-stast";
import { getTopCategoriesWithComparison } from "@/lib/actions/product";
import TopProducts from "@/components/stats/product-stats";
import { getTopProductsInCategory } from "@/lib/actions/product";
import StatsContent from "@/components/stats/stats-content";

// app/admin/stats/page.tsx
export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  
  const currentDate = new Date();
  const year = params.year 
    ? parseInt(params.year) 
    : currentDate.getFullYear();
  const month = params.month 
    ? parseInt(params.month) 
    : currentDate.getMonth() + 1;

  return (
    <div>
      <Suspense fallback={<AdminStatsSkeleton />}>
        <StatsContent year={year} month={month} />
      </Suspense>
    </div>
  );
}