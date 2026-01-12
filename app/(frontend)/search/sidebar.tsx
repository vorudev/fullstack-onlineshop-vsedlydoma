// components/FilterSidebar.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2, ChevronDown, ArrowUpDown} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ProductList from "./sort";
import Pagination from "@/components/frontend/pagination-client";

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'rating-asc';
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
filterCategories: FilterCategoryWithFilters[] | undefined;
categories: (string | null)[]
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  query: string;
avaliableManufacturers: { id: string; name: string }[] | undefined
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
    attributes: {
        id: string;
        name: string;
        createdAt: Date | null;
        value: string;
        slug: string;
        order: number | null;
        productId: string;
    }[];
    averageRating: number;
    reviewCount: number;
    priceRegional: number | null;
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

// Удачи тому кто сюда полез 

export default function FilterSidebar({ filterCategories, categories, query, page, totalPages, total, limit, avaliableManufacturers, productsWithDetails }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [expandedCategories, setExpandedCategories] = useState(['price']);
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [productCount, setProductCount] = useState(0)
  const [loadingCount, setLoadingCount] = useState(false)
  const [expandedCategoriesMobile, setExpandedCategoriesMobile] = useState<Record<string, boolean>>({});
  const [priceFrom, setPriceFrom] = useState<number | undefined>(undefined);
  const [priceTo, setPriceTo] = useState<number | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(filterCategories?.[0]?.id || null);
  const applyPriceOnBlur = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    Array.from(params.keys()).forEach(key => {
      if (key !== 'chain' && key !== 'category' && key !== 'page' && key !== 'search') {
        params.delete(key);
      }
    });
    
    Object.entries(selectedFilters).forEach(([slug, ids]) => {
      if (ids.length > 0) {
        params.set(slug, ids.join(','));
      }
    });
    
    if (priceFrom) params.set('priceFrom', priceFrom.toString());
    if (priceTo) params.set('priceTo', priceTo.toString());
    
    router.push(`${pathname}?${params.toString()}`);
    setAppliedFilters(selectedFilters);
    setAppliedPriceFrom(priceFrom);
    setAppliedPriceTo(priceTo);
  };
  
  const handlePriceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyPriceOnBlur();
      (e.target as HTMLInputElement).blur(); // Убираем фокус
    }
  };
 const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'chain' && key !== 'category' && key !== 'page' && key !== 'search') {
        initial[key] = value.split(',');
      }
    });
    return initial;
  });

 
  const sortOptions = [
    { value: 'default', label: 'По умолчанию' },
    { value: 'price-asc', label: 'Цена: по возрастанию' },
    { value: 'price-desc', label: 'Цена: по убыванию' },
    { value: 'rating-desc', label: 'Рейтинг: по убыванию' },
    { value: 'rating-asc', label: 'Рейтинг: по возрастанию' },
  ];
  const getSortLabel = () => {
    return sortOptions.find(opt => opt.value === sortBy)?.label || 'По умолчанию';
  };
  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setOpenSort(false);
  };
const VISIBLE_FILTERS_COUNT = 5;

  const handleFilterChange = (filterSlug: string, filterId: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const current = prev[filterSlug] || [];
      if (checked) {
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

  const handleRemoveFilterProperty = (filterSlug: string, filterId: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const current = prev[filterSlug] || [];
      if (checked) {
        return { ...prev, [filterSlug]: [...current, filterId] };
      } else {
        const updated = current.filter(id => id !== filterId);
        if (updated.length === 0) {
          const { [filterSlug]: _, ...rest } = prev;
          return rest; 
        }
        return { ...prev, [filterSlug]: updated }; 
      }
    });
  
    applyFilters();
    router.refresh();
  };

   const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    Array.from(params.keys()).forEach(key => {
      if (key !== 'chain' && key !== 'category' && key !== 'page' && key !== 'search') {
        params.delete(key);
      }
    });
    
    Object.entries(selectedFilters).forEach(([slug, ids]) => {
      if (ids.length > 0) {
        params.set(slug, ids.join(','));
      }
    });
    params.set('priceFrom', priceFrom?.toString() || '');
    params.set('priceTo', priceTo?.toString() || '');
    router.push(`${pathname}?${params.toString()}`);
    setAppliedFilters(selectedFilters);
  setAppliedPriceFrom(priceFrom);
  setAppliedPriceTo(priceTo);
  };

  const applyFiltersInstant = (filterSlug: string, filterId: string, checked: boolean) => { 
    const current = selectedFilters[filterSlug] || [];
    let newSelectedFilters: typeof selectedFilters;
    
    if (checked) {

      newSelectedFilters = { 
        ...selectedFilters, 
        [filterSlug]: [...current, filterId] 
      };
    } else {
      const updated = current.filter(id => id !== filterId);
      if (updated.length === 0) {
        const { [filterSlug]: _, ...rest } = selectedFilters;
        newSelectedFilters = rest;
      } else {
        newSelectedFilters = { 
          ...selectedFilters, 
          [filterSlug]: updated 
        };
      }
    }
    
    setSelectedFilters(newSelectedFilters);
    
    const params = new URLSearchParams(searchParams.toString());

    Array.from(params.keys()).forEach(key => {
      if (key !== 'chain' && key !== 'category' && key !== 'page' && key !== 'search') {
        params.delete(key);
      }
    });
    
    Object.entries(newSelectedFilters).forEach(([slug, ids]) => {
      if (ids.length > 0) {
        params.set(slug, ids.join(','));
      }
    });
    
    if (priceFrom) params.set('priceFrom', priceFrom.toString());
    if (priceTo) params.set('priceTo', priceTo.toString());

    router.push(`${pathname}?${params.toString()}`);

    setAppliedFilters(newSelectedFilters);
    setAppliedPriceFrom(priceFrom);
    setAppliedPriceTo(priceTo);
  };



  const [appliedFilters, setAppliedFilters] = useState(selectedFilters);
  const [appliedPriceFrom, setAppliedPriceFrom] = useState(priceFrom);
  const [appliedPriceTo, setAppliedPriceTo] = useState(priceTo);
  


  // Сбросить фильтры
  const resetFilters = () => {
    setSelectedFilters({});
    const params = new URLSearchParams(searchParams.toString());
    Array.from(params.keys()).forEach(key => {
      if (key !== 'chain') {
        params.delete(key);
      }
    });
    router.push(`${pathname}?search=${query}`);
    setAppliedFilters({});
  };

  if(filterCategories !== undefined && avaliableManufacturers !== undefined) {const allFilterCategories = [
  {
    id: 'manufacturer',
    slug: 'manufacturer',
    name: 'Производители',
    filters: avaliableManufacturers?.map(m => ({
      id: m.id,
      slug: 'manufacturer',
      name: m.name,
    })),
  },
  ...filterCategories, // остальные идут после
]; 
    const sortedProducts = useMemo(() => {
      if (!productsWithDetails) return [];
      
      const productsCopy = [...productsWithDetails];
      
      switch (sortBy) {
        case 'price-asc':
          return productsCopy.sort((a, b) => a.price - b.price);
        case 'price-desc':
          return productsCopy.sort((a, b) => b.price - a.price);
        case 'rating-desc':
          return productsCopy.sort((a, b) => b.averageRating - a.averageRating);
        case 'rating-asc':
          return productsCopy.sort((a, b) => a.averageRating - b.averageRating);
        default:
          return productsCopy;
      }
    }, [productsWithDetails, sortBy]);
   
     const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  useEffect(() => {
    const fetchCount = async () => {
      const filtersBySlug: Record<string, string[]> = {};
      
      for (const [slug, filterIds] of Object.entries(selectedFilters)) {
        const category = allFilterCategories.find(cat => 
          cat.filters.some(f => f.slug === slug)
        );
        
        if (category) {
          const filterNames = category.filters
            .filter(f => filterIds.includes(f.id))
            .map(f => f.name);
          
          if (filterNames.length > 0) {
            filtersBySlug[slug] = filterNames;
          }
        }
      }
      

      setLoadingCount(true);
      try {
        // ✅ Фильтруем null значения из categories
        console.log(categories)
        const categoryIds = categories.filter((c): c is string => c !== null);
        
        const response = await fetch('/api/filter/itemsCount', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            filtersBySlug,
            categoryIds, 
            query, 
            priceFrom,
            priceTo // ✅ Передаем отфильтрованные categoryIds
          }),
        });
        
        const data = await response.json();
        console.log(data)
        setProductCount(data.count);
      } catch (error) {
        console.error('Error fetching count:', error);
      } finally {
        setLoadingCount(false);
      }
    };

    fetchCount();
  }, [selectedFilters, categories, priceFrom, priceTo])// ✅ Зависимость от selectedFilters, а не selectedCategory
  
  useEffect(() => {
    if (openSort) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [openSort]);
    
  console.log(priceFrom)
  return (
    <>
    <div className={`lg:hidden flex flex-col gap-4 ${appliedFilters ? "mb-" :""}`}>
    <div className=" flex px-2 flex-row gap-2 justify-between ">
     
        <button 
        onClick={() => setOpenSort(!open)}
        className="flex flex-row items-center gap-1">
<ArrowUpDown  className="w-5 h-5 text-gray-400"/>
<p className="text-[16px] ">
{getSortLabel()}
</p>
        </button>
        <button onClick={() => setOpen(!open)} className=" flex flex-row gap-1 items-center"><Settings2 className="w-5 h-5 text-gray-400"/>Фильтры</button>
    </div>
    <div className="w-full overflow-x-auto scrollbar-hide px-2" 
    >
  <div className="flex gap-2 min-w-min ">
    
    {Object.entries(appliedFilters).map(([slug, ids]) =>
      ids.map(id => {
        const filterGroup = allFilterCategories.find(f => (f as any).slug === slug);
        const filterItem = filterGroup?.filters?.find(f => f.id === id);
        if (!filterItem) return null;
        return (
          
          <div
            key={`${slug}-${id}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm whitespace-nowrap flex-shrink-0"
          >
            <span className="text-xs text-gray-500">{filterGroup?.name}:</span>
            <span>{filterItem.name}</span>
            <button
              onClick={() => handleRemoveFilterProperty(slug, id, false)}
              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        );
      })
    )}
  </div>
</div>
      </div>
    <AnimatePresence>
  {openSort && (
    <div className="fixed inset-0 z-[1000] lg:hidden ">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpenSort(false)}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Сортировка</h3>
          <button
            onClick={() => setOpenSort(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col p-4 max-h-[70vh] overflow-y-auto">
          {sortOptions.map((option, index) => (
            <button
              key={option.value}
       
            
              onClick={() => handleSortChange(option.value as SortOption)}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                sortBy === option.value
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-sm font-medium">{option.label}</span>
              {sortBy === option.value && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    {open && (
      <div className="fixed top-0  left-0 w-full h-full bg-white z-1000">
        <div className="flex flex-col h-full">
          {/* Хедер */}
          <div className="w-full gap-2 flex items-center justify-center relative px-4 py-2">

           
            <h2 className="text-[14px] font-semibold text-center">Фильтры</h2>
            <button onClick={() => setOpen(false)} className="absolute right-4 ">
              <X className="w-6 h-6"/>
            </button>
           
          </div>
          
          
          {/* Основной контент */}
          <div className="flex  px-[16px] flex-col flex-1 overflow-hidden">
            {/* Левая колонка - категории */}
            <div className="w-full scrollbar-hide overflow-y-auto">
            <div className="space-y-3 pt-2">
         
              <p className="text-[14px] font-bold ">Цена</p>
                  <div className="flex items-center gap-3 px-1">
                    <input
                      type="number"
                      placeholder="От"
                      value={priceFrom || ''}
                      onChange={(e) => setPriceFrom(Number(e.target.value) || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200 focus:ring-blue-600/50 focus:border-transparent"
                    />
                    <span className="text-gray-400">—</span>
                    <input
                      type="number"
                      placeholder="До"
                      value={priceTo || ''}
                      onChange={(e) => setPriceTo(Number(e.target.value) || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200 focus:ring-blue-600/50 focus:border-transparent"
                    />
                  </div>
                </div>
              {allFilterCategories.map(category => (
                <div 
                key={category.id}>
                <button
                 
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    w-full text-left font-bold text-[#39393D] text-clamp-2 py-2 text-[14px] transition-colors
                    ${selectedCategory === category.id 
                      ? 'bg-white' 
                      : 'hover:bg-gray-200'
                    }
                  `}
                >
                  {category.name}
                </button>
                <div className="flex flex-col ">
                {category.filters
  ?.slice(0, expandedCategoriesMobile[category.id] ? undefined : VISIBLE_FILTERS_COUNT)
  .map(filter => (
    <div key={filter.id}>
      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
        <input
          type="checkbox"
          checked={selectedFilters[filter.slug]?.includes(filter.id) || false}
          onChange={(e) => handleFilterChange(filter.slug, filter.id, e.target.checked)}
          className="sr-only peer"
        />
        <div className="relative w-[18px] h-[18px] bg-gray-100 rounded-[5px] peer-checked:bg-blue-500 transition-colors flex items-center justify-center">
          {(selectedFilters[filter.slug]?.includes(filter.id) || false) && (
            <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
              <path
                d="M13 4L6 11L3 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span className="text-sm text-gray-700">{filter.name}</span>
      </label>
    </div>
  ))
}


{category.filters && category.filters.length > VISIBLE_FILTERS_COUNT && (
  <button
    onClick={() => setExpandedCategoriesMobile(prev => ({
      ...prev,
      [category.id]: !prev[category.id]
    }))}
    className="text-sm text-blue-600 hover:text-blue-700 font-medium py-1 px-1 text-left transition-colors"
  >
    {expandedCategoriesMobile[category.id] 
      ? '↑ Скрыть' 
      : `↓ Показать все (${category.filters.length})`
    }
  </button>
)}
                  </div>
                </div>
              ))} 
            </div>
            
            {/* Правая колонка - значения фильтров */}
           
          </div>
          
          {/* Футер с кнопками */}
         <div className="flex flex-col  mt-2 gap-2 px-3 py-2 border-t border-gray-200">
         <div className="flex flex-wrap gap-2">
        
     {Object.keys(selectedFilters).some(slug => selectedFilters[slug].length > 0) && (
  <button
    onClick={() => { 
      resetFilters(); 
      setOpen(false);
    }}
    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 hover:bg-gray-300 rounded-full text-sm text-[12px] transition-colors"
  >
    <span>Сбросить</span>
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
)}

{Object.entries(selectedFilters).map(([slug, ids]) =>
  ids.map(id => {
    const filterGroup = allFilterCategories.find(f => (f as any).slug === slug);
    const filterItem = filterGroup?.filters?.find(f => f.id === id);
    if (!filterItem) return null;
    return (
      <div
        key={`${slug}-${id}`}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm"
      >
        <span className="text-xs text-gray-500">{filterGroup?.name}:</span>
        <span>{filterItem.name}</span>
        <button
          onClick={() => handleFilterChange(slug, id, false)}
          className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  })
)}
      </div>
      <div className="flex flex-row gap-1">  
 
  
  <button
  onClick={() => {
    applyFilters();
    setOpen(false);
  }}
  className="px-4 py-2 min-h-[40px] bg-blue-600 w-full text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={loadingCount}
>
{loadingCount ? (
  <span className="flex items-center justify-center gap-2">
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </span>
) : Object.keys(selectedFilters).length === 0 && priceFrom == undefined && priceTo == undefined? (
  <span>Применить</span>
) : productCount === 0 ? (
  <span>Нет найденных товаров</span>
) : (
  <span>
    Показать {productCount}{' '}
    {productCount === 1 
      ? 'товар' 
      : productCount > 1 && productCount < 5 
      ? 'товара' 
      : 'товаров'}
  </span>
)}
</button>
</div>
          </div>
        </div>
      </div>
    )}



<div className="flex flex-row w-full gap-5 pb-30">
  <div className=" w-[370px] overflow-hidden  bg-white rounded-2xl lg:block hidden">
      {/* Заголовок */}
    

<div className="">
<div className="space-y-3 pt-4">
<div className="flex flex-col gap-2">
    <p className="text-[16px] px-4">Сортировка</p>
    <div className="px-4 flex flex-col gap-2">
      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
        <input
          type="radio"
          name="sort"
          value="default"
          checked={sortBy === 'default'}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-sm text-gray-700">По умолчанию</span>
      </label>
      
      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
        <input
          type="radio"
          name="sort"
          value="price-asc"
          checked={sortBy === 'price-asc'}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-sm text-gray-700">Цена: по возрастанию</span>
      </label>
      
      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
        <input
          type="radio"
          name="sort"
          value="price-desc"
          checked={sortBy === 'price-desc'}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-sm text-gray-700">Цена: по убыванию</span>
      </label>
      
      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
        <input
          type="radio"
          name="sort"
          value="rating-desc"
          checked={sortBy === 'rating-desc'}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-sm text-gray-700">Рейтинг: по убыванию</span>
      </label>
      
      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
        <input
          type="radio"
          name="sort"
          value="rating-asc"
          checked={sortBy === 'rating-asc'}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-sm text-gray-700">Рейтинг: по возрастанию</span>
      </label>
    </div>
  </div>
              <p className="text-[16px] px-4 ">Цена</p>
                  <div className="flex items-center gap-3 px-4 py-1">
                    <input
                      type="number"
                      placeholder="От"
                      value={priceFrom || ''}
                      onChange={(e) => setPriceFrom(Number(e.target.value) || undefined)}
    onBlur={applyPriceOnBlur}
    onKeyDown={handlePriceKeyDown}

                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200 focus:ring-blue-600/50 focus:border-transparent"
                    />
                    <span className="text-gray-400">—</span>
                    <input
                      type="number"
                      placeholder="До"
                      value={priceTo || ''}
                      onChange={(e) => setPriceTo(Number(e.target.value) || undefined)}
                  
                      onBlur={applyPriceOnBlur}
                      onKeyDown={handlePriceKeyDown}
                  
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200 focus:ring-blue-600/50 focus:border-transparent"
                    />
                  </div>
                </div>
  {allFilterCategories.map(category => (
    <div key={category.id} className="cursor-pointer">
      {/* Заголовок категории */}
      <button
        onClick={() => toggleCategory(category.id)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-100 transition duration-200 hover:text-blue-600"
      >
        <span className="">{category.name}</span>
        <motion.div
          animate={{ rotate: expandedCategories.includes(category.id) ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>

      {/* Содержимое категории с анимацией */}
      <AnimatePresence initial={false}>
        {expandedCategories.includes(category.id) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
            
                <div className="space-y-2 pt-2 max-h-60 overflow-y-auto">
                  {category.filters?.map(filter => (
  <div key={filter.id}>
  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
    <input
      type="checkbox"
      checked={selectedFilters[filter.slug]?.includes(filter.id) || false}
      onChange={(e) => applyFiltersInstant(filter.slug, filter.id, e.target.checked)}
      className="sr-only peer"
    />
    <div className="relative w-[18px] h-[18px] bg-gray-100 rounded-[5px] peer-checked:bg-blue-500 transition-colors flex items-center justify-center">
      {(selectedFilters[filter.slug]?.includes(filter.id) || false) && (
        <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
          <path
            d="M13 4L6 11L3 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
    <span className="text-sm text-gray-700">{filter.name}</span>
  </label>
</div>
))}
                </div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ))}
</div>


      {/* Кнопка применения */}
      
    </div>
    
      <div className={`flex flex-col w-full gap-2 px-2 ${openSort ? "overflow-hidden" : ""}`}>
      <div className="lg:flex gap-2 min-w-min pt-[16px] hidden ">
  {Object.keys(appliedFilters).some(slug => appliedFilters[slug].length > 0) && (
    <button
      className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap flex-shrink-0 hover:bg-gray-200 transition-colors"
      onClick={() => {
        resetFilters()
      }}
    >
      <span>Сбросить всё</span>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )}
  
  {Object.entries(appliedFilters).map(([slug, ids]) =>
    ids.map(id => {
      const filterGroup = allFilterCategories.find(f => (f as any).slug === slug);
      const filterItem = filterGroup?.filters?.find(f => f.id === id);
      if (!filterItem) return null;
      return (
        <div
          key={`${slug}-${id}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm whitespace-nowrap flex-shrink-0"
        >
          <span className="text-xs text-gray-500">{filterGroup?.name}:</span>
          <span>{filterItem.name}</span>
          <button
            onClick={() => handleRemoveFilterProperty(slug, id, false)}
            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      );
    })
  )}
</div>
        <ProductList  products={sortedProducts}  />
       <div className="w-full max-w-[600px] mx-auto"> <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            total={total}
                            limit={limit}
                          />
                          </div>
        </div>
      </div>
      </>
  );
}
return null
}