'use client';
import { createProductAttribute, updateProductAttribute } from "@/lib/actions/attributes";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { Product } from "@/db/schema";
import type { ProductAttribute } from "@/db/schema";
import { Category } from "@/db/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AttributeCategory } from "@/db/schema";
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
import { or } from "drizzle-orm";

interface AttributeFormProps {
    attribute?: ProductAttribute;
    product: Product;
    categories: {id: string, name: string}[]
    category?: AttributeCategory;
}
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    value: z.string().min(1, "Value is required"),
    order: z.number().nullable(),
    productId: z.string().uuid("Product ID is required"),
    slug: z.string().min(1, "Slug is required"),
   categoryId: z.string().uuid("Attribute Category ID is required"),
})

export default function AttributeForm({ attribute, product, categories, category }: AttributeFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: attribute?.name || "",
            value: attribute?.value || "",
            order: attribute?.order || 0,
            productId: product.id || "",
            categoryId: category?.id || "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const attributeData = { ...values, 
                productId: product.id, 

            };
            if (attribute) {
                await updateProductAttribute({ ...attributeData, id: attribute.id });
            } else {
                await createProductAttribute(attributeData);
            }
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
                          <FormLabel>Название характеристики    </FormLabel>
                            <FormDescription>Это название характеристики, например "цвет".</FormDescription>
                            <FormControl>
                                <Input placeholder="Например, цвет" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Значение</FormLabel>
                            <FormDescription>Это значения для характеристики, например "красный".</FormDescription>
                            <FormControl>
                                <Input placeholder="Например, красный" {...field} />
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
                          <FormLabel>SLUG (Название характеристики для фильтрации)</FormLabel>
                            <FormDescription>Это значения именно для фильтрации, оно не видно пользователю, но нужно для правильной работы системы фильтров. Оно тесно связано с полем "Slug" при создании фильтров. Например, если создаем характеристику "цвет" со значением "красный", то slug будет "Color". Обязательно на английском, без пробелов</FormDescription>
                            <FormControl>
                                <Input placeholder="Например, Color" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
    control={form.control}
    name="order"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Порядок отображения</FormLabel>
            <FormControl>
                <Input 
                    placeholder="Order" 
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
<FormField
    control={form.control}
    name="categoryId"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Категория</FormLabel>
            <Select onValueChange={field.onChange}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
    )}
/>

                <Button disabled={isLoading} type="submit">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {attribute ? "Обновить характеристику" : "Создать характеристику"}
                </Button>
            </form>
        </Form>
    )
}