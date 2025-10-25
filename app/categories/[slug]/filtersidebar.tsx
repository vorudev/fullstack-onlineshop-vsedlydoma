// components/FilterSidebar.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";


interface Filter {
  id: string;
  name: string;
  slug: string;
}

interface FilterCategory {
  id: string;
  name: string;
  slug: string;
}
interface Filter {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
}

interface FilterCategoryWithFilters {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  filters: Filter[];
}

interface FilterSidebarProps {
filterCategories: FilterCategoryWithFilters[];
avaliableManufacturers: { id: string; name: string }[]

}

export default function FilterSidebar({ filterCategories, avaliableManufacturers }: FilterSidebarProps) {
  const router = useRouter();
    const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Инициализируем состояние из URL
 const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'chain') {
        initial[key] = value.split(',');
      }
    });
    return initial;
  });
  // Обработчик выбора фильтра
  const handleFilterChange = (filterSlug: string, filterId: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const current = prev[filterSlug] || [];
      
      if (checked) {
        // Добавляем фильтр
        return { ...prev, [filterSlug]: [...current, filterId] };
      } else {
        // Убираем фильтр
        const updated = current.filter(id => id !== filterId);
        if (updated.length === 0) {
          const { [filterSlug]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [filterSlug]: updated };
      }
    });
  };

  // Применить фильтры
   const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Удаляем старые фильтры
    Array.from(params.keys()).forEach(key => {
      if (key !== 'chain') {
        params.delete(key);
      }
    });
    
    // Добавляем новые
    Object.entries(selectedFilters).forEach(([slug, ids]) => {
      if (ids.length > 0) {
        params.set(slug, ids.join(','));
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };


  // Сбросить фильтры
  const resetFilters = () => {
    setSelectedFilters({});
    const params = new URLSearchParams(searchParams.toString());
    Array.from(params.keys()).forEach(key => {
      if (key !== 'chain') {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-64 p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Фильтры</h2>
      
      {filterCategories.map(category => (
        <div key={category.id} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
            {category.filters.map(filter => (
              <div key={filter.id} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={filter.id}
                  checked={selectedFilters[filter.slug]?.includes(filter.id) || false}
                  onChange={(e) => handleFilterChange(filter.slug, filter.id, e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor={filter.id}>{filter.name}</label>
              </div>
            ))}
        </div>
      ))}
      <h3 className="text-lg font-semibold mb-2">Производители</h3>
      {avaliableManufacturers.map(manufacturer => (
        <div key={manufacturer.id} className="mb-1">
          <input
            type="checkbox"
            id={manufacturer.id}
            checked={selectedFilters.manufacturer?.includes(manufacturer.id) || false}
            onChange={(e) => handleFilterChange('manufacturer', manufacturer.id, e.target.checked)}
            className="mr-2"
          />
          <label htmlFor={manufacturer.id}>{manufacturer.name}</label>
        </div>
      ))}

      <div className="mt-6 space-y-2">
        <button
          onClick={applyFilters}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Применить
        </button>
        
        <button
          onClick={resetFilters}
          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}