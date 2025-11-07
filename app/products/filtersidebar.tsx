// components/FilterSidebar.tsx
"use client";

import { useMemo, useState } from "react";
import { X, Settings2} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ProductList from "./sort";
import type ProductUnited from "./page";

interface Filter {
  id: string;
  name: string;
  slug: string;
}
type SortOption = 'default' | 'price-asc' | 'price-desc';
interface Filter {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
}
interface Review {
  averageRating: {
    averageRating: number;
    reviewCount: number;
  };
  reviewCount: {
    reviewCount: number;
    averageRating: number;
  }
}

// Сначала создайте отдельные типы для переиспользования

  

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
categorySlug: string | undefined;
productsWithDetails: {
    images: {
        id: string;
        productId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        order: number | null;
        isFeatured: boolean | null;
        createdAt: Date | null;
    }[];
    averageRating: number;
    reviewCount: number;
    id: string;
    categoryId: string | null;
    inStock: string | null;
    price: number;
    slug: string;
    title: string;
    description: string;
    manufacturerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    sku: string | null;
}[] | undefined
}


export default function FilterSidebar({ filterCategories, avaliableManufacturers, categorySlug, productsWithDetails }: FilterSidebarProps) {
  const router = useRouter();
    const pathname = usePathname();
    const [sortBy, setSortBy] = useState<SortOption>('default');
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [priceFrom, setPriceFrom] = useState<number | undefined>(undefined);
  const [priceTo, setPriceTo] = useState<number | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
  filterCategories[0]?.id || null
);
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
    params.set('priceFrom', priceFrom?.toString() || '');
    params.set('priceTo', priceTo?.toString() || '');
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
    router.push(`${pathname}?category=${categorySlug}`);
  };

  const allFilterCategories = [
    ...filterCategories,
    {
      id: 'manufacturer',
      name: 'Производители',
      filters: avaliableManufacturers.map(m => ({
        id: m.id,
        slug: 'manufacturer',
        name: m.name
      }))
    },
    {
    id: 'price',
    name: 'Цена',
    filters: [] // Особый случай - рендерим кастомный контент
  }
  ];
    const sortedProducts = useMemo(() => {
      if (!productsWithDetails) return [];
      
      const productsCopy = [...productsWithDetails];
      
      switch (sortBy) {
        case 'price-asc':
          return productsCopy.sort((a, b) => a.price - b.price);
        case 'price-desc':
          return productsCopy.sort((a, b) => b.price - a.price);
        default:
          return productsCopy;
      }
    }, [productsWithDetails, sortBy]);
  return (
    <>
    <div className="flex flex-row gap-2 justify-between ">
     
          <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className=" py-2 outline-none px-0 m-0 flex border-none ring-none"
        >
          <option value="default" className="outline-none ring-none px-0 flex">По умолчанию</option>
          <option value="price-asc" >Цена: по возрастанию</option>
          <option value="price-desc" >Цена: по убыванию</option>
        </select>
        <button onClick={() => setOpen(!open)} className="lg:hidden flex flex-row gap-1 items-center"><Settings2 className="w-5 h-5 text-gray-400"/>Фильтры</button>
    </div>
 
    {open && (
      <div className="fixed top-0 left-0 w-full h-full bg-white z-50">
        <div className="flex flex-col h-full">
          {/* Хедер */}
          <div className="flex flex-row justify-between gap-2 px-3 py-4 border-b border-gray-200">
            <div className="flex flex-row gap-1 items-center justify-center">
            <button onClick={() => setOpen(false)} className="">
              <X className="w-5 h-5 text-gray-400"/>
            </button>
            <h2 className="text-xl font-semibold">Фильтры</h2></div>
            <button onClick={() => {
                resetFilters();
                setOpen(false);
              }} className="text-blue-600 text-sm">
              Сбросить Все
            </button>
           
          </div>
          
          {/* Основной контент */}
          <div className="flex flex-row flex-1 overflow-hidden">
            {/* Левая колонка - категории */}
            <div className="w-2/5 bg-gray-100 overflow-y-auto">
              {allFilterCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    w-full text-left px-3 text-clamp-2 py-2 text-[14px] transition-colors
                    ${selectedCategory === category.id 
                      ? 'bg-white' 
                      : 'hover:bg-gray-200'
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Правая колонка - значения фильтров */}
            <div className="w-3/5 p-4 overflow-y-auto">
              {selectedCategory && (
                <div>
                  {/* Специальная обработка для фильтра цены */}
                  {selectedCategory === 'price' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Диапазон цен
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            placeholder="От"
                            value={priceFrom || ''}
                            onChange={(e) => setPriceFrom(Number(e.target.value) || undefined)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-400">—</span>
                          <input
                            type="number"
                            placeholder="До"
                            value={priceTo || ''}
                            onChange={(e) => setPriceTo(Number(e.target.value) || undefined)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Обычные чекбоксы для остальных фильтров
                    allFilterCategories
                      .find(cat => cat.id === selectedCategory)
                      ?.filters.map(filter => (
                        <div key={filter.id} className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            id={filter.id}
                            checked={selectedFilters[filter.slug]?.includes(filter.id) || false}
                            onChange={(e) => handleFilterChange(filter.slug, filter.id, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={filter.id} className="ml-2 cursor-pointer text-gray-700">
                            {filter.name}
                          </label>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Футер с кнопками */}
         <div className="flex flex-row  gap-2 px-3 py-2 border-t border-gray-200">
            <button 
              onClick={() => {
                applyFilters();
                setOpen(false);
              }}
             
              className="px-4 py-2 bg-blue-600 w-full text-white rounded-md hover:bg-blue-700"
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    )}



<div className="flex flex-row w-full">
  <div className="hidden lg:block">
    <div className="w-64 p-4 border-r ">
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
    </div>
    
      <ProductList  products={sortedProducts}  />
      </div>
      </>
  );
}