'use client';
import { z } from "zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { manufacturers, Product } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { updateProduct, createProduct } from "@/lib/actions/product";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useEffect } from "react";
import { getCategories } from "@/lib/actions/product-categories";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import { Input } from "@/components/ui/input"
import { ca } from "zod/v4/locales";


interface ProductFormProps {
    product?: Product;
    categories: {id: string, name: string}[];
    manufacturers: {id: string, name: string}[]
}
const formSchema = z.object({
 price: z.number().min(1, "Price is required"), 
 title: z.string().min(1, "Title is required"),
categoryId: z.string().uuid("Category ID is required"),
manufacturerId: z.string().uuid("Manufacturer ID is required"),
    slug: z.string().min(1, "Slug is required").max(255, "Slug must be less than 255 characters"), 
    description: z.string().min(1, "Description is required"),

})

export function ProductForm({product, categories: initialCategories, manufacturers: initialManufacturers}: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    // Manufacturer state
    const [manufacturerOpen, setManufacturerOpen] = useState(false);
    const [manufacturerSearch, setManufacturerSearch] = useState('');
    const [manufacturers, setManufacturers] = useState(initialManufacturers);
    const [manufacturerSearchLoading, setManufacturerSearchLoading] = useState(false);

    // Category state
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');
    const [categories, setCategories] = useState(initialCategories);
    const [categorySearchLoading, setCategorySearchLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        price: product?.price ? Number(product.price) : 0, 
        categoryId: product?.categoryId || "",
        title: product?.title || "",
        slug: product?.slug || "", 
        description: product?.description || "",
        manufacturerId: product?.manufacturerId || "",
      },
    })

    // Поиск производителей
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
          console.error('Error searching manufacturers:', error);
        } finally {
          setManufacturerSearchLoading(false);
        }
      };

      const debounce = setTimeout(searchManufacturers, 300);
      return () => clearTimeout(debounce);
    }, [manufacturerSearch, initialManufacturers]);

    // Поиск категорий
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
      setIsLoading(true)
      try {
        const productData = { 
          ...values,
        } 
        if (product) {
          await updateProduct({ ...productData, id: product.id });
        } else {
          await createProduct(productData);
        }

        form.reset();
        setIsLoading(false);
        router.refresh();
      } catch (error) {
        console.error("Error submitting form:", error);
        setIsLoading(false);
        throw new Error("Failed to submit form");
      }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input placeholder="Введите название" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="product-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea placeholder="Введите описание" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
  control={form.control}
  name="price"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Цена</FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder="0"
          {...field}
          value={field.value || ''}
          onChange={(e) => {
            const value = e.target.value;
            field.onChange(value === '' ? '' : Number(value));
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

          {/* Category Combobox */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Категория</FormLabel>
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
                              form.setValue("categoryId", category.id);
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

          {/* Manufacturer Combobox */}
          <FormField
            control={form.control}
            name="manufacturerId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Производитель</FormLabel>
                <Popover open={manufacturerOpen} onOpenChange={setManufacturerOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={manufacturerOpen}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? manufacturers.find((m) => m.id === field.value)?.name
                          : "Выберите производителя..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Поиск производителя..." 
                        value={manufacturerSearch}
                        onValueChange={setManufacturerSearch}
                      />
                      <CommandEmpty>
                        {manufacturerSearchLoading ? 'Загрузка...' : 'Производитель не найден'}
                      </CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {manufacturers.map((manufacturer) => (
                          <CommandItem
                            key={manufacturer.id}
                            value={manufacturer.name}
                            onSelect={() => {
                              form.setValue("manufacturerId", manufacturer.id);
                              setManufacturerOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === manufacturer.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {manufacturer.name}
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

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Сохранение..." : product ? "Обновить" : "Создать"}
          </Button>
        </form>
      </Form>
    )
}