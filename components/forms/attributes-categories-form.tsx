'use client'    

import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createAttributeCategory, updateAttributeCategory } from "@/lib/actions/attributes-categories";
import { AttributeCategory } from "@/db/schema";

interface AttributeCategoryFormProps {
    category?: AttributeCategory;
    

}
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    displayOrder: z.number().nullable(),

})
export function AttributeCategoryForm({ category }: AttributeCategoryFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: category?.name || "",
            slug: category?.slug || "",
            displayOrder: category?.displayOrder || null,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const attributeCategoryData = {
                ...values,
            }
            if (category) {
                await updateAttributeCategory({ ...attributeCategoryData, id: category.id });
            } else {
                await createAttributeCategory(attributeCategoryData);
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Attribute Category Name" {...field} />
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
                            <FormLabel>slug</FormLabel>
                            <FormControl>
                                <Input placeholder="Attribute Category Slug" {...field} />
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
                            <FormLabel>Display Order</FormLabel>
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
                <Button disabled={isLoading} type="submit">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {category ? "Update Category" : "Create Category"}
                </Button>
            </form>
        </Form>
    )
}
