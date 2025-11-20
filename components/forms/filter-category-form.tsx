'use client'
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { useState } from "react";
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
import { createFilterCategory} from "@/lib/actions/filter-categories";
import { FilterCategory } from "@/db/schema";

interface FilterCategoryFormProps {
    category?: FilterCategory;
    productCategoryId: string; 
}
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    displayOrder: z.number().nullable(),
    productCategory: z.string().uuid("Product Category ID is required"),
})
export function FilterCategoryForm({ category, productCategoryId }: FilterCategoryFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: category?.name || "",
            displayOrder: category?.displayOrder || null,
            productCategory: productCategoryId || "",
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const filterCategoryData = {
                ...values,
                productCategoryId: productCategoryId,
                slug: slugify(values.name, {
                  lower: true,
                  strict: true,
                  locale: 'ru',
                }),
            }
            await createFilterCategory(filterCategoryData);            
            form.reset();
            setIsLoading(false);
            router.refresh();
        } catch (error) {
            console.log(error);
            setIsLoading(false);
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
                            <FormLabel>Название категории фильтров, например "цвет"</FormLabel>
                            <FormControl>
                                <Input placeholder="Название" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="displayOrder"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Порядок отображения</FormLabel>
                            <FormControl>
                                <Input 
                    placeholder="Порядок отображения" 
                    type="number" 
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? null : Number(value));
                    }}
                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                          
                    
                <Button disabled={isLoading} type="submit" >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Сохранить
                </Button>
            </form>
        </Form>
    )
}