'use client';
import { Input } from "@/components/ui/input"; 
import {createTelegramChatId, updateTelegramChatId} from "@/lib/actions/admin";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TelegramChatId } from "@/db/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
interface  NewsProps {
     telegramChatId? : TelegramChatId
        
}

const newsSchema = z.object({
    chatId: z.string().min(1, "Обязательное поле").max(255, "Максимум 255 символов"),
});

type NewsFormValues = z.infer<typeof newsSchema>;

export function AddTelegramChatId({ telegramChatId }: NewsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<NewsFormValues>({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            chatId: telegramChatId?.chatId || "",
        },
    });

    async function onSubmit(values: NewsFormValues) {
        setIsLoading(true);
        try {
            if (telegramChatId) {
                await updateTelegramChatId({
                    ...values,
                    id: telegramChatId.id,
                });
                toast.success("Информация обновлена")
            } else {
                await createTelegramChatId({
                    ...values,
                });
                toast.success("Информация обновлена")
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
                    name="chatId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chat ID</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Введите Chat ID" {...field} />
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