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
  selectedStatus?: boolean | undefined;
}

export function StatusFilter({ selectedStatus }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
 // const [selectedStatus, setSelectedStatus] = useState<string>('')


  const handleCategoryChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (!status) {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    
    // Сбрасываем на первую страницу при смене фильтра
    params.delete('page');
    
    router.push(`?${params.toString()}`);
  };
 const handleStatusTrue = () => { 
    const params =  new URLSearchParams(searchParams.toString());
    params.delete("status")
      // Сбрасываем на первую страницу при смене фильтра
      params.delete('page');
    
      router.push(`?${params.toString()}`);
 }

  return (
    <Popover >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between"
        >
         {selectedStatus === false ? "Неактивные" : selectedStatus === true ? "Активные" : "Активные"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          
          
          <CommandEmpty>
          {selectedStatus === false ? "Неактивные" : selectedStatus === true ? "Активные" : "Активные"}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
        
           
              <CommandItem
           
                onSelect={() => handleStatusTrue()}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                  
                  )}
                />
                Активные
              </CommandItem>
              <CommandItem
           
           onSelect={() => handleCategoryChange('false')}
         >
           <Check
             className={cn(
               "mr-2 h-4 w-4",
             
             )}
           />
           Неактивные
         </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}