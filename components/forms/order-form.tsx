'use client';

import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

import { useState } from "react";
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
import { createOrder } from "@/lib/actions/orders";
import { user } from "@/db/schema";

interface OrderFormProps {
   items:{
    id: string,
    title: string,
    sku: string | null,
    price: number,
    quantity: number
   }[]


}
const formSchema = z.object({
  status: z.string(),
  customerName: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name must be at most 50 characters." }),
  customerEmail: z.string().email({ message: "Invalid email address." }),
  customerPhone: z.string().min(10, { message: "Phone number must be at least 10 characters." }).max(15, { message: "Phone number must be at most 15 characters." }),
  notes: z.string().nullable(),


});
export default function OrderForm( {items}: OrderFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
        const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "pending",
            customerName: "",
            customerEmail: "",
            customerPhone: "",
            
          

        }
        });
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
    
        const testDataItems = items.map((item) => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            productSku: item.sku,
            quantity: item.quantity, 
            
        }))
         ;
   { /*   productId: "prod_123", */ }
          try {
            const result = await createOrder(values, testDataItems);
            
            console.log("✅ Заказ создан:", result);
            // Показать success message
        } catch (error) {
            console.error("❌ Ошибка:", error);
            // Показать error message
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
        <FormField
          control={form.control}
            name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Products title" {...field} />
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
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Product Price" type="email" {...field} />
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                       <Input 
          placeholder="Phone Number" 
          {...field}
          onChange={(e) => {
            // Разрешаем только цифры и пробелы
            const value = e.target.value.replace(/[^\d\s]/g, '');
            field.onChange(value);
          }}
        />

              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
            name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Products description" {...field} />
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
              <FormLabel>notes</FormLabel>
              <FormControl>
                <Input placeholder="notes" {...field}  value={field.value ?? ""}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        
        
       <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
        "Create Order"
        }</Button>
      </form>
    </Form>
    );
}