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
    status: z.string(),
    customerName: z.string().min(2, { message: "Имя должно содержать не менее 2 символов" }).max(50, { message: "Имя должно содержать не более 50 символов" }),
    customerEmail: z.string().email({ message: "Неверный email адрес." }),
    customerPhone: z.string().min(10, { message: "Номер телефона должен содержать не менее 10 символов" }).max(15, { message: "Номер телефона должен содержать не более 15 символов" }),
    notes: z.string().nullable(),
    total: z.number().min(0, { message: "Общая стоимость должна быть положительной" }),

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
        if (!order) {
        console.error("Order not found");
        return;
    }
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
            <FormLabel>Статус</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="pending">Оформлен</SelectItem>
                    <SelectItem value="completed">Получен</SelectItem>
                    <SelectItem value="cancelled">Отменен</SelectItem>
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
                                <Input {...field} value={field.value ?? ""}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Обновить за
                </Button>
            </form>
        </Form>
    );
}