'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
}

export default function Pagination({ currentPage, totalPages, total }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    // Все остальные параметры (search, category) сохраняются автоматически!
    router.push(`?${params.toString()}`);
  };


  // Генерируем номера страниц для отображения
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Сколько страниц показывать
    
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
    <div className="flex flex-col  text-black items-center justify-center gap-2 mt-8">
      {/* Кнопка "Предыдущая" */}
      <div className="flex flex-row gap-2"><button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        ← Назад
      </button>

      {/* Первая страница */}
      {currentPage > 3 && (
        <>
          <button
            onClick={() => goToPage(1)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            1
          </button>
          {currentPage > 4 && <span className="px-2">...</span>}
        </>
      )}

      {/* Номера страниц */}
      <div className="flex-row gap-2 hidden lg:flex">{getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-4 py-2 border rounded ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))} </div>

      {/* Последняя страница */}
     <div className="flex flex-row gap-2 hidden lg:flex"> {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && <span className="px-2">...</span>}
          <button
            onClick={() => goToPage(totalPages)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}</div>

      {/* Кнопка "Следующая" */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Вперед →
      </button></div>

      {/* Информация */}
      <span className="ml-4 text-sm text-gray-600">
        Страница {currentPage} из {totalPages} (всего: {total})
      </span>
    </div>
  );
}