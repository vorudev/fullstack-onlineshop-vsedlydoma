'use server';
import { getMonthlyOrderStats } from '@/lib/actions/orders';
import { getTopCategoriesWithComparison } from '@/lib/actions/product';
import AdminStats from '@/components/stats/stats-client';
import CategoriesStats from '@/components/stats/category-stast';
import MonthSelector from './month-selector';
import { getTopProductsInCategory } from '@/lib/actions/product';
import TopProducts from './product-stats';
import { get } from 'http';

interface StatsContentProps {
  year: number;
  month: number;
}

export default async function StatsContent({ year, month }: StatsContentProps) {
  const [stats, categories] = await Promise.all([
    getMonthlyOrderStats(year, month),
    getTopCategoriesWithComparison(year, month),

  ]);


  return (
    <div className="space-y-6">
      <MonthSelector currentYear={year} currentMonth={month} />
      <AdminStats stats={stats} />
      <CategoriesStats category={categories} />

    </div>
  );
}