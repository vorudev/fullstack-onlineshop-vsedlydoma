'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from './ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';
interface CategoryFilterProps {
  categories: Array<{ id: string; name: string }>;
  selectedCategory?: string;
}

export function CategoryFilter({ categories: initialCategories, selectedCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [categories, setCategories] = useState(initialCategories);
  const [categorySearchLoading, setCategorySearchLoading] = useState(false);

  useEffect(() => {
    const searchCategories = async () => {
      if (categorySearch.length < 2) {
        setCategories(initialCategories);
        return;
      }

      setCategorySearchLoading(true);
      try {
        const response = await fetch(`/api/categories/search?search=${encodeURIComponent(categorySearch)}`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error searching categories:', error);
      } finally {
        setCategorySearchLoading(false);
      }
    };

    const debounce = setTimeout(searchCategories, 300);
    return () => clearTimeout(debounce);
  }, [categorySearch, initialCategories]);

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (!categoryId) {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    
    // Сбрасываем на первую страницу при смене фильтра
    params.delete('page');
    
    router.push(`?${params.toString()}`);
    setCategoryOpen(false);
  };

  const selectedCategoryName = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.name 
    : null;

  return (
    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={categoryOpen}
          className="w-[200px] justify-between"
        >
          {selectedCategoryName || "Все категории"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Поиск категории..." 
            value={categorySearch}
            onValueChange={setCategorySearch}
          />
          <CommandEmpty>
            {categorySearchLoading ? 'Загрузка...' : 'Категория не найдена'}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            <CommandItem
              value="all"
              onSelect={() => handleCategoryChange('')}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  !selectedCategory ? "opacity-100" : "opacity-0"
                )}
              />
              Все категории
            </CommandItem>
            {categories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.name}
                onSelect={() => handleCategoryChange(category.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCategory === category.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {category.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}