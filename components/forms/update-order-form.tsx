'use client';
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Order, OrderItem } from "@/db/schema";
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
import { updateOrder } from "@/lib/actions/orders";
interface UpdateOrderFormProps {
    order?: Order
    
}
const formSchema = z.object({
    status: z.string().optional(),
    customerName: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name must be at most 50 characters." }),
    customerEmail: z.string().email({ message: "Invalid email address." }),
    customerPhone: z.string().min(10, { message: "Phone number must be at least 10 characters." }).max(15, { message: "Phone number must be at most 15 characters." }),
    notes: z.string().nullable(),
    total: z.number().min(0, { message: "Total must be a positive number." }).optional(),

});
export function UpdateOrderForm({ order }: UpdateOrderFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: order?.status,
            customerName: order?.customerName || "",
            customerEmail: order?.customerEmail || "",
            customerPhone: order?.customerPhone || "",
            notes: order?.notes || "",
            total: order?.total || 0,
           
        },
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await updateOrder({ ...values, id: order.id } );
            router.refresh();
        } catch (error) {
            console.error("Error updating order:", error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
    control={form.control}
    name="status"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
    )}
/>
                <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Имя Покупателя</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Покупателя</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Номер телефона</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Заметки к заказу</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Order
                </Button>
            </form>
        </Form>
    );
}