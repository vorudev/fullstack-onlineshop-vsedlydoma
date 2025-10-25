'use client';
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
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

interface FilterFormProps {
    filter?: Filter;
    categoryId: string; 
}

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),    
    displayOrder: z.number().nullable(),
    categoryId: z.string().uuid("Filter Category ID is required"),
})
export function FilterForm({ filter, categoryId }: FilterFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: filter?.name || "",
            slug: filter?.slug || "",
            displayOrder: filter?.displayOrder || null,
            categoryId: categoryId || "",
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const filterData = {
                ...values,
                categoryId: categoryId,
            }
            await createFilter(filterData);
            form.reset();
            setIsLoading(false);
            router.refresh();
        } catch (error) {
            console.error("Error submitting form:", error);
            throw new Error("Failed to submit form");
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
                            <FormLabel>Значение</FormLabel>
                            <FormDescription>Это значения для категории фильтрования, например "красный" к slug "color".</FormDescription>
                            <FormControl>
                                <Input placeholder="Значение" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                             <FormDescription>Это значения именно для фильтрации, оно не видно пользователю, но нужно для правильной работы системы фильтров. Оно тесно связано с полем "Slug" при создании характеристики. Например, "color" Обязательно на английском, без пробелов</FormDescription>
                            <FormControl>
                                <Input placeholder="Slug" {...field} />
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
                <Button disabled={isLoading} type="submit">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Сохранить
                </Button>
            </form>
        </Form>
    )
}