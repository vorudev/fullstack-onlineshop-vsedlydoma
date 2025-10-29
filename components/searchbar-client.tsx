'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || ''
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
      params.set('page', '1'); // Сбрасываем на первую страницу
    } else {
      params.delete('search');
    }
    
    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setSearchValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.set('page', '1');
    
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Поиск по сайту"
            className="w-full px-4 py-1 border bg-gray-100 border-gray-200 rounded-lg focus:outline-none hover:border-gray-300 hover: hover:shadow-md transition duration-300 ease-in-out"
          />
          
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isPending}
          className="px-6 py- disabled:opacity-50 items-center gap-2 hidden md:flex"
        >
          {isPending ? (
            <>
              <Search />
              Ищем...
            </>
          ) : (
            <>
              <Search />
              Поиск
            </>
          )}
        </Button>
      </div>
    </form>
  );
}