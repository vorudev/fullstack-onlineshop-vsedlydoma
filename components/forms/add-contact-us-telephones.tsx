'use client'
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContactTelephone, updateContactTelephone } from "@/lib/actions/contact-us-telephones";
import { ContactTelephone } from "@/db/schema";
import { Loader2 } from "lucide-react";
interface AboutFormProps {
    contactTelephone?: ContactTelephone | null
    contactUsId: string | null 
}

const aboutSchema = z.object({
    phone: z.string().min(1, "Phone is required").max(255, "Phone must be at most 255 characters long"),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export function AddContactUsTelephone({ contactTelephone, contactUsId }: AboutFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AboutFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues: {
            phone: contactTelephone?.phone || "",
        
        },
    });

    async function onSubmit(values: AboutFormValues) {
        setIsLoading(true);
        try {
            if (contactTelephone) {
                await updateContactTelephone({
                    ...values,
                    contactUsId: contactUsId,
                     id: contactTelephone.id,
                });
            } else {
                
            createContactTelephone(
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
                            <FormLabel>Телефон</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Введите телефон" {...field} />
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
