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
import { set } from 'zod';
interface ManufacturerFilterProps {
  manufacturers: { id: string; name: string }[];
  selectedManufacturer?: string;
}

export function ManufacturerFilter({ manufacturers: initialManufacturers, selectedManufacturer }: ManufacturerFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [manufacturerOpen, setManufacturerOpen] = useState(false);
  const [manufacturerSearch, setManufacturerSearch] = useState('');
  const [manufacturers, setManufacturers] = useState(initialManufacturers);
  const [manufacturerSearchLoading, setManufacturerSearchLoading] = useState(false);

  useEffect(() => {
    const searchManufacturers = async () => {
      if (manufacturerSearch.length < 2) {
        setManufacturers(initialManufacturers);
        return;
      }

      setManufacturerSearchLoading(true);
      try {
        const response = await fetch(`/api/manufacturers/search?search=${encodeURIComponent(manufacturerSearch)}`);
        const data = await response.json();
        setManufacturers(data);
      } catch (error) {
        console.error('Error searching categories:', error);
      } finally {
        setManufacturerSearchLoading(false);
      }
    };

    const debounce = setTimeout(searchManufacturers, 300);
    return () => clearTimeout(debounce);
  }, [manufacturerSearch, initialManufacturers]);

  const handleManufacturerChange = (manufacturerId: string) => {
    const params = new URLSearchParams(searchParams.toString());
     
    if (!manufacturerId) {
      params.delete('manufacturer');
    } else {
      params.set('manufacturer', manufacturerId);
    }
    
    // Сбрасываем на первую страницу при смене фильтра
    params.delete('page');
    
    router.push(`?${params.toString()}`);
    setManufacturerOpen(false);
  };

  const selectedManufacturerName = selectedManufacturer
    ? manufacturers.find(c => c.id === selectedManufacturer)?.name 
    : null;

  return (
    <Popover open={manufacturerOpen} onOpenChange={setManufacturerOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={manufacturerOpen}
          className="w-[200px] justify-between"
        >
          {selectedManufacturerName || "Все производители"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Поиск категории..." 
            value={manufacturerSearch}
            onValueChange={setManufacturerSearch}
          />
          <CommandEmpty>
            {manufacturerSearchLoading
              ? "Поиск..."
              : "Ничего не найдено"}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            <CommandItem
              value="all"
              onSelect={() => handleManufacturerChange('')}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  !selectedManufacturer ? "opacity-100" : "opacity-0"
                )}
              />
              Все производители
            </CommandItem>
            {manufacturers.map((manufacturer) => (
              <CommandItem
                key={manufacturer.id}
                value={manufacturer.id}
                onSelect={() => handleManufacturerChange(manufacturer.id)}  
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedManufacturer === manufacturer.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {manufacturer.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}