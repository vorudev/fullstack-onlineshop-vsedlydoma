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
import slugify from "slugify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { toast } from "sonner";

interface AttributeFormProps {
    attribute?: ProductAttribute;
    product: Product;
}
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    value: z.string().min(1, "Value is required"),
    order: z.number().nullable(),
    productId: z.string().uuid("Product ID is required"),
})

export default function AttributeForm({ attribute, product }: AttributeFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: attribute?.name || "",
            value: attribute?.value || "",
            order: attribute?.order || 0,
            productId: product.id || "",
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const attributeData = { 
                ...values, 
                productId: product.id, 
                slug: slugify(values.name, {
                    lower: true,
                    strict: true,
                    locale: 'ru',
                }),
            };
            
            if (attribute) {
                await updateProductAttribute({ ...attributeData, id: attribute.id });
                toast.success("Атрибут успешно обновлён");
            } else {
                await createProductAttribute(attributeData);
                toast.success("Атрибут успешно создан");
            }
            
            form.reset();
            router.refresh();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Ошибка при сохранении атрибута");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 ">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Название характеристики    </FormLabel>
                            
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
                           
                            <FormControl>
                                <Input placeholder="Например, красный" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </div>


                <Button disabled={isLoading} type="submit">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {attribute ? "Обновить характеристику" : "Создать характеристику"}
                </Button>
            </form>
        </Form>
    )
}