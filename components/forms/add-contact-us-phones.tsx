'use client'
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContactPhone, updateContactPhone } from "@/lib/actions/contact-us-phones";
import { ContactPhone } from "@/db/schema";
import { Loader2 } from "lucide-react";
interface AboutFormProps {
    contactPhone?: ContactPhone | null
    contactUsId: string | null 
}

const aboutSchema = z.object({
    phone: z.string().min(1, "Phone is required").max(255, "Phone must be at most 255 characters long"),
    src: z.string().min(1, "Src is required").max(255, "Src must be at most 255 characters long"),
    link: z.string().min(1, "Link is required").max(255, "Link must be at most 255 characters long"),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export function AddContactUsPhones({ contactPhone, contactUsId }: AboutFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AboutFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues: {
            phone: contactPhone?.phone || "",
            src: contactPhone?.src || "",
            link: contactPhone?.link || "",
        
        },
    });

    async function onSubmit(values: AboutFormValues) {
        setIsLoading(true);
        try {
            if (contactPhone) {
                await updateContactPhone({
                    ...values,
                    contactUsId: contactUsId,
                     id: contactPhone.id,
                });
            } else {
                
            createContactPhone(
                {
                    ...values,
                    contactUsId: contactUsId,
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
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Телефон, айди или имя</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Введите телефон, айди или имя в соцсети" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="src"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Иконка</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Введите ссылку на иконку" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ссылка</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Введите ссылку" {...field} />
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
