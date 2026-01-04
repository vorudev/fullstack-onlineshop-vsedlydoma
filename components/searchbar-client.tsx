'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import {Suspense} from 'react';
const searchSchema = z
  .string()
  .max(200, 'Поисковый запрос слишком длинный (максимум 200 символов)')
  .trim()
  // Удаляем потенциально опасные символы
  .transform((val) => val.replace(/[<>{}]/g, ''))
  // Проверяем на SQL-инъекции
  .refine(
    (val) => !/(union|select|insert|update|delete|drop|exec|script)/gi.test(val),
    'Поисковый запрос содержит недопустимые команды'
  )
  // Проверяем на XSS
  .refine(
    (val) => !/<script|javascript:|onerror=|onload=/gi.test(val),
    'Поисковый запрос содержит недопустимый код'
  )
  // Проверяем на path traversal
  .refine(
    (val) => !/\.\.\/|\.\.\\/.test(val),
    'Поисковый запрос содержит недопустимые символы'
  );

type SearchSchema = z.infer<typeof searchSchema>;

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || ''
  );
  const [error, setError] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Останавливаем всплытие события
    setError('');

    // Проверка на пустое значение (убираем пробелы)
    const trimmedValue = searchValue.trim();
    
    if (!trimmedValue) {
      setError('Введите поисковый запрос');
      return; // Останавливаем выполнение
    }

    // Валидация с помощью Zod
    const result = searchSchema.safeParse(trimmedValue);
    if (!result.success) {
      setError(result.error.message);
      return;
    }

    // Используем валидированное значение
    const sanitizedSearch = result.data;
    const params = new URLSearchParams(searchParams.toString());
    
    params.set('search', sanitizedSearch);
    params.set('page', '1');

    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setSearchValue('');
    setError('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.set('page', '1');
    
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (error) setError('');
  };

  // Проверяем, можно ли отправить форму
  const canSubmit = searchValue.trim().length > 0 && !isPending && !error;

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              placeholder="Поиск по сайту"
              className={`w-full px-4 py-2 h-[37px] border ${
                error ? 'border-red-500 bg-red-50' : 'bg-gray-100 border-gray-200'
              } rounded-lg focus:outline-none hover:border-gray-300 hover:shadow-md transition duration-300 ease-in-out`}
              aria-invalid={!!error}
              aria-describedby={error ? 'search-error' : undefined}
            />
            {searchValue && !error && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Очистить поиск"
              >
                ✕
              </button>
            )}
          </div>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="px-6 py-2 h-[37px] disabled:opacity-50 items-center gap-2 hidden md:flex"
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
        {error && (
          <p id="search-error" className="text-red-500 text-sm">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}