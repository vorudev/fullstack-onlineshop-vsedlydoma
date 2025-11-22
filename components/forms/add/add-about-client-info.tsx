'use client'
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientInfo, updateClientInfo } from "@/lib/actions/about-client-info";
import { ClientInfo } from "@/db/schema";
import { Loader2 } from "lucide-react";
interface AboutFormProps {
    clientInfo?: ClientInfo | null
    aboutId: string | null 
}

const aboutSchema = z.object({
    info: z.string().min(1, "Info is required").max(255, "Info must be at most 255 characters long"),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export function AddAboutClientInfo({ clientInfo, aboutId }: AboutFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AboutFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues: {
            info: clientInfo?.info || "",
        
        },
    });

    async function onSubmit(values: AboutFormValues) {
        setIsLoading(true);
        try {
            if (clientInfo) {
                await updateClientInfo({
                    ...values,
                    aboutId: aboutId,
                     id: clientInfo.id,
                });
            } else {
                
            createClientInfo(
                {
                    ...values,
                    aboutId: aboutId,
                }
            );
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
                    name="info"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>информация</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Введите название" {...field} />
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
