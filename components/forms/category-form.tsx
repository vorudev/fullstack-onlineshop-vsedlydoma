'use client';
import { z } from "zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Category } from "@/db/schema";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createCategory, updateCategory } from "@/lib/actions/product-categories";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useState } from "react";
import slugify from "slugify";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CategoryFormProps {
  category?: Category
  categories: {id: string, name: string}[]
}
export const formSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
    parentId: z.string().nullable(),
})

export function CategoryForm({category, categories: initialCategories}: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
   const [categoryOpen, setCategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');
    const [categories, setCategories] = useState(initialCategories);
    const [categorySearchLoading, setCategorySearchLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      parentId: category?.parentId || null,
    },
  })
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
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try { 
        const categoryData = {
            ...values,
            slug: slugify(values.name, {
              lower: true,
              strict: true,
              locale: 'ru',
            }),
        }
        if (category) {
            await updateCategory({ ...categoryData, id: category.id });
            toast.success("Категория успешно обновлена")
        } else {
            await createCategory(categoryData);
            toast.success("Категория успешно создана")
            form.reset({
            name: "",
            parentId: values.parentId, // Сохраняем текущее значение категории
        });
        }
        
        setIsLoading(false);
        router.refresh();
    } catch (error) {
      toast.error("Ошибка при создании категории")
        console.error("Ошибка при создании категории:", error);
        throw new Error("Ошибка при создании категории");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название категории *</FormLabel>
              <FormControl>
                <Input placeholder="Название категории" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Родительская категория </FormLabel>
                <FormDescription>(если это главная категория, оставьте пустым)</FormDescription>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryOpen}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? categories.find((c) => c.id === field.value)?.name
                          : "Выберите категорию..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
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
                        {categories.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.name}
                            onSelect={() => {
                              form.setValue("parentId", category.id);
                              setCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === category.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

    
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Сохранить
        </Button>
      </form>
    </Form>
  )
}
