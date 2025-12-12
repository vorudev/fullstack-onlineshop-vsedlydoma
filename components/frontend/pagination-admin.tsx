// components/Pagination.tsx
'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
}

export default function Pagination({ currentPage, totalPages, total, limit }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    // Все остальные параметры (search, category) сохраняются автоматически!
    router.push(`?${params.toString()}`);
  };
const showMoreItems = (limit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', limit.toString());
    router.push(`?${params.toString()}`);
}

  // Генерируем номера страниц для отображения
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 8; // Сколько страниц показывать
    
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-3 mt-8">
        <button
        onClick={() => showMoreItems(limit + 20)}
        className="px-4 py-3 border text-sm text-white hover:bg-neutral-800 transition-colors duration-300 rounded-xl cursor-pointer border-neutral-700 border disabled:opacity-50 disabled:cursor-not-allowed bg-neutral-900 w-full  "
      >
        Показать ещё
      </button>
      {/* Кнопка "Предыдущая" */}
     <div className="flex px-1  w-full border-neutral-700 border rounded-xl bg-neutral-900 items-center justify-between gap-2">
     <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center cursor-pointer gap-2  rounded disabled:opacity-50 disabled:cursor-not-allowed "
      >
        <ChevronLeft className="text-white" />

      </button>

      {/* Первая страница */}
      
      {/* Номера страниц */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={` py-3 px-2 text-sm lg:px-4 cursor-pointer font-semibold text-gray-200 ${
            page === currentPage
              ? 'border-b-2  border-b-blue-600 text-gray-200 '
              : 'hover:bg-neutral-800  text-gray-200'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Последняя страница */}
     

      {/* Кнопка "Следующая" */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center cursor-pointer gap-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        <ChevronRight className="text-white" />
      </button>
     </div>
      {/* Информация */}
      <span className="ml-4 text-sm text-gray-600">
        Страница {currentPage} из {totalPages} (всего: {total})
      </span>
    </div>
  );
}