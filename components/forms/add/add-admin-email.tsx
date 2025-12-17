'use client';
import { Input } from "@/components/ui/input"; 
import {createAdminEmail, updateAdminEmail} from "@/lib/actions/admin";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AdminEmail } from "@/db/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
interface  NewsProps {
     adminEmail? : AdminEmail
        
}

const newsSchema = z.object({
    email: z.string().min(1, "Обязательное поле").max(255, "Максимум 255 символов"),
});

type NewsFormValues = z.infer<typeof newsSchema>;

export function AddAdminEmail({ adminEmail }: NewsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<NewsFormValues>({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            email: adminEmail?.email || "",
        },
    });

    async function onSubmit(values: NewsFormValues) {
        setIsLoading(true);
        try {
            if (adminEmail) {
                await updateAdminEmail({
                    ...values,
                    id: adminEmail.id,
                    
                });
                toast.success("Почта успешно добавлена")
            } else {
                await createAdminEmail({
                    ...values,
                });
                 toast.success("Почта успешно добавлена")
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Введите Email" {...field} />
                            </FormControl>
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