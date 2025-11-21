'use client'
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateContactUs, createContactUsInfo} from "@/lib/actions/contact-us";
import { ContactPhone } from "@/db/schema";
import { Loader2 } from "lucide-react";
interface FormProps {
    contactUs: {
    clientInfo: {
        id: string;
        phone: string;
        src: string;
        contactUsId: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[];
    id: string;
    title: string;
    description: string;
    createdAt: Date | null;
    updatedAt: Date | null;
} | null

}

const aboutSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters long"),
    description: z.string().min(1, "Description is required").max(255, "Description must be at most 255 characters long"),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

type ContactUsFormValues = z.infer<typeof aboutSchema>;

export function AddContactUsInfo({ contactUs }: FormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ContactUsFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues: {
            title: contactUs?.title || "",
            description: contactUs?.description || "",
        },
    });

    async function onSubmit(values: ContactUsFormValues) {
        setIsLoading(true);
        try {
            if (contactUs) {
                await updateContactUs({
                    ...values,
                    id: contactUs.id,
                });
            } else {
                await createContactUsInfo(values);
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
                            <FormLabel>Описание</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Введите описание" {...field} />
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
