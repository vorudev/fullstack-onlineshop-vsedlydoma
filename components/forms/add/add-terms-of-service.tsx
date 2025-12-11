'use client'
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTermsOfService, createTermsOfService, updatePrivacyPolicy } from "@/lib/actions/law-actions";
import { About } from "@/db/schema";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor";
interface TermsOfServiceFormProps {
    termsOfService?: {
    id: string;
    title: string;
    description: string;
    createdAt: Date | null;
    updatedAt: Date | null;
} | null
}

const aboutSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters long"),
    description: z.string().min(1, "Description is required").max(100000, "Description must be at most 255 characters long"),
    createdAt: z.date().optional(),
    
    updatedAt: z.date().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export function AddTermsOfServise({ termsOfService }: TermsOfServiceFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AboutFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues: {
            title: termsOfService?.title || "",
            description: termsOfService?.description || "",
        },
    });

    async function onSubmit(values: AboutFormValues) {
        setIsLoading(true);
        try {
            if (termsOfService) {
               await updateTermsOfService({
                ...values,
                id: termsOfService.id
            })
            } else 
            {
                await createTermsOfService({
                    ...values
                })
            }
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
                            <FormLabel>Название</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Политика обработки персональных данных" {...field} />
                            </FormControl>
                            <FormDescription>Это название, которое будет отображаться на странице политики обработки персональных данных</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Home */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Текст политики обработки персональных данных</FormLabel>
                            <FormControl>
                            <RichTextEditor
          value={field.value}
          onChange={field.onChange}
          placeholder="Введите текст политики..."
        />
                            </FormControl>
                            <FormDescription>Это текст политики обработки персональных данных, который будет отображаться на странице политики обработки персональных данных</FormDescription>
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
