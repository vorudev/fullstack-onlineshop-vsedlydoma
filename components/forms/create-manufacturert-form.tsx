'use client';
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useState } from "react";
import slugify from "slugify";
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
import { createManufacturer, updateManufacturer } from "@/lib/actions/manufacturer";
import { Manufacturer } from "@/db/schema";
import { toast } from "sonner";

interface ManufacturerFormProps {
    manufacturer?: Manufacturer
}

const manufacturerFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
});

export function ManufacturerForm({ manufacturer }: ManufacturerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof manufacturerFormSchema>>({
        resolver: zodResolver(manufacturerFormSchema),
        defaultValues: {
            name: manufacturer?.name || "",
            description: manufacturer?.description || "",
        },
    });

    async function onSubmit(values: z.infer<typeof manufacturerFormSchema>) {
        setLoading(true);
        try {
            if (manufacturer) {
                await updateManufacturer({ ...values, id: manufacturer.id, slug: slugify(values.name, { lower: true, strict: true, locale: 'ru' }) });
                toast.success("Производитель успешно обновлен")
            } else {
                await createManufacturer({ ...values, slug: slugify(values.name, { lower: true, strict: true, locale: 'ru' }) });
                toast.success("Производитель успешно создан")
            }
            form.reset();
            setLoading(false);
            router.refresh();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(error as string)
            setLoading(false);
            router.refresh();
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Название производителя</FormLabel>
                            <FormControl>
                                <Input placeholder="Название производителя" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Описание производителя</FormLabel>
                            <FormControl>
                                <Input placeholder="Описание производителя" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
             
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {manufacturer ? "Обновить производителя" : "Создать производителя"}
                </Button>
            </form>
        </Form>
    )
}