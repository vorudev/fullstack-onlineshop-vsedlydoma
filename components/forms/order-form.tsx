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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 ">
        <div className="grid md:grid-cols-2 gap-4 ">
        <FormField
          control={form.control}
            name="customerName"
          render={({ field }) => (
            <FormItem >
              <FormLabel>Имя</FormLabel>
              <FormControl className=" border border-gray-300 rounded-md h-12 py-0   ">
               <div className="bg-white flex items-center h-full ">
                <Input placeholder="Иван Иванов" className="w-full focus:outline-none focus:ring-blue-500 focus:ring-2 border-none focus:border-none" {...field}  /></div>
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
              <FormLabel>Почта</FormLabel>
              <FormControl className=" border border-gray-300 rounded-md h-12 py-0   ">
                <div className="bg-white flex items-center h-full "><Input placeholder="example@gmail.com" className="w-full focus:outline-none focus:ring-blue-500 focus:ring-2 border-none focus:border-none" type="email" {...field} /></div>
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
              <FormControl className=" border border-gray-300 rounded-md h-12 py-0   ">
                       <div className="bg-white flex items-center h-full "><Input 
                       className="w-full focus:outline-none focus:ring-blue-500 focus:ring-2 border-none focus:border-none"
          placeholder="89999999999" 
          {...field}
          onChange={(e) => {
            // Разрешаем только цифры и пробелы
            const value = e.target.value.replace(/[^\d\s]/g, '');
            field.onChange(value);
          }}
        /> </div>

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
              <FormControl className=" border border-gray-300 rounded-md h-12 py-0   ">
                <div className="bg-white flex items-center h-full "><Input className="w-full focus:outline-none focus:ring-blue-500 focus:ring-2 border-none focus:border-none" placeholder="" {...field}  value={field.value ?? ""}/></div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         </div>
        
        
        
       <Button type="submit" className="bg-blue-500 text-white w-full lg:w-[200px] h-[48px] hover:bg-blue-600" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
        "Создать заказ"
        }</Button>
      </form>
    </Form>
    );
}