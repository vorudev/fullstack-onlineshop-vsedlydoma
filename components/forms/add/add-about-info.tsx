'use client'
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAboutInfo, createAboutInfo } from "@/lib/actions/about-info";
import { About } from "@/db/schema";
import { Loader2 } from "lucide-react";
interface AboutFormProps {
    about?: {
    id: string;
    title: string;
    home: string;
    description: string;
    createdAt: Date | null;
    updatedAt: Date | null;
} | null
}

const aboutSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters long"),
    description: z.string().min(1, "Description is required").max(255, "Description must be at most 255 characters long"),
   home: z.string().min(1, "Home is required").max(255, "Home must be at most 255 characters long"),
    createdAt: z.date().optional(),
    
    updatedAt: z.date().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export function AddAboutInfo({ about }: AboutFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AboutFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues: {
            title: about?.title || "",
            description: about?.description || "",
            home: about?.home || "",
        },
    });

    async function onSubmit(values: AboutFormValues) {
        setIsLoading(true);
        try {
            if (about) {
               await updateAboutInfo({
                ...values,
                id: about.id
            })
            } else 
            {
                await createAboutInfo({
                    ...values
                })
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Заголовок</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Введите заголовок" {...field} />
                            </FormControl>
                            <FormDescription>Это заголовок, который будет отображаться на странице о нас</FormDescription>
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
                            <FormDescription>Это описание, которое будет отображаться на странице о нас</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Home */}
                <FormField
                    control={form.control}
                    name="home"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Описание (Домашняя страница)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Введите описание" {...field} />
                            </FormControl>
                            <FormDescription>Это описание, которое будет отображаться на домашней странице </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

               

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Сохранить
                </Button>
            </form>
        </Form>
    );
}
