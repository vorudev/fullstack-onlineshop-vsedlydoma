'use client';
import { z } from "zod";
import { Loader2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { createFilter } from "@/lib/actions/filters";
import { Filter } from "@/db/schema";
import { ca } from "zod/v4/locales";
import { FilterCategory } from "@/db/schema";

interface FilterFormProps {
    filter?: Filter;
    category: FilterCategory; 
}

const formSchema = z.object({
    name: z.string().min(1, "Название обязательно"),
    displayOrder: z.number().nullable(),
    categoryId: z.string().uuid("Filter Category ID is required"),
})
export function FilterForm({ filter, category }: FilterFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: filter?.name || "",
            displayOrder: filter?.displayOrder || null,
            categoryId: category.id || "",
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const filterData = {
                ...values,
                categoryId: category.id,
                slug: slugify(category.name, {
                  lower: true,
                  strict: true,
                  locale: 'ru',
                }),
            }
            await createFilter(filterData);
            toast.success("Фильтр успешно создан")
            form.reset();
            setIsLoading(false);
            router.refresh();
        } catch (error) {
            toast.error(error as string)
            console.error("Error submitting form:", error);
            throw new Error("Failed to submit form");
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3  flex-row ">
                 
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem> 
                          
                            <FormControl>
                                <Input placeholder="Введите новое значение (например, Красный)" {...field}  className="min-w-[350px]" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
               
                
                <Button    
                variant="outline"
                type="submit"
                className="gap-2"
                >
                
 {isLoading ? <Loader2 className="animate-spin"></Loader2> : <div className="flex flex-row items-center gap-2"><Plus className="h-4 w-4" /> Добавить </div>} </Button>
            </form>
        </Form>
    )
}