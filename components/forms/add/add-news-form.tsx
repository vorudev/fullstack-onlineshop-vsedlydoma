'use client'
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import slugify from "slugify";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateNews, createNews } from "@/lib/actions/news";
import { News } from "@/db/schema";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
interface  NewsProps {
    news? : {
        title: string;
        id: string;
    description: string;
    slug: string;
    }
}

const newsSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters long"),
    description: z.string().min(1, "Description is required").max(1000, "Description must be at most 1000 characters long"),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

type NewsFormValues = z.infer<typeof newsSchema>;

export function AddNews({ news }: NewsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<NewsFormValues>({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            title: news?.title || "",
            description: news?.description || "",
        },
    });

    async function onSubmit(values: NewsFormValues) {
        setIsLoading(true);
        try {
            if (news) {
                await updateNews({
                    ...values,
                    id: news.id,
                    slug: slugify(values.title),
                });
                toast.success("Информация обновлена")
            } else {
                await createNews({
                    ...values,
                    slug: slugify(values.title),
                });
                toast.success("Новость успешно создана")
            }
            form.reset();
            setIsLoading(false);
            router.refresh();
        } catch (error) {
            toast.error("Произошла ошибка")
            console.error("Error submitting form:", error);
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
                                <Textarea placeholder="Введите название" {...field} />
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
                            <FormLabel>Текст новости</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Введите текст новости" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Home */}
                

               

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Сохранить
                </Button>
            </form>
        </Form>
    );
}
