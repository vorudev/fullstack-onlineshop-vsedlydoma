'use client';

import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useCart } from "@/app/context/cartcontext"
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
import { useSession } from "@/lib/auth-client"
import { user } from "@/db/schema";

interface ProductUnited {
   
  product: {
    averageRating: number;
    reviewCount: number;
    id: string;
    categoryId: string | null;
    inStock: string | null;
    price: number;
    slug: string;
    title: string;
    description: string;
    manufacturerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    sku: string | null;
    images: {
        id: string;
        productId: string;
        imageUrl: string;
        storageType: string;
        storageKey: string | null;
        order: number | null;
        isFeatured: boolean | null;
        createdAt: Date | null;
    }[]
}
}
interface CartItem {
 product: ProductUnited['product'];
 quantity: number;
}
interface OrderFormProps {
  items: CartItem[];


}
const formSchema = z.object({
  customerName: z.string().min(2, { message: "Имя должно содержать не менее 2 символов." }).max(50, { message: "Имя должно содержать не более 50 символов." })
  .refine(
      (val) => !/<script|javascript:|onerror=/i.test(val),
      'Invalid content detected'
    ),
  customerEmail: z.string().email({ message: "Неверный email адрес." }).refine(
      (val) => !/<script|javascript:|onerror=/i.test(val),
      'Invalid content detected'
    ),
  customerPhone: z.string().min(10, { message: "Номер телефона должен содержать не менее 10 символов." }).max(15, { message: "Номер телефона должен содержать не более 15 символов." })
  .refine(
      (val) => !/<script|javascript:|onerror=/i.test(val),
      'Invalid content detected'
    ),
notes: z.string().nullable()
  .refine(
    (val) => val === null || val.length <= 255,
    { message: "Заметка должна содержать не более 255 символов." }
  )
  .refine(
    (val) => val === null || !/<script|javascript:|onerror=/i.test(val),
    { message: 'Invalid content detected' }
  )


});
export default function OrderForm( {items}: OrderFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const { cart, clearCart } = useCart();
        const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: session?.user?.name || "",
            customerEmail: session?.user?.email || "",
            customerPhone: session?.user?.phoneNumber || "",
            notes: null,
          

        }
        });
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
    
        const testDataItems = items.map((item) => ({
            productId: item.product.id,
            title: item.product.title,
            price: item.product.price,
            productSku: item.product.sku,
            quantity: item.quantity, 
            
        }))
         ;
   { /*   productId: "prod_123", */ }
          try {
            const result = await createOrder(values, testDataItems);
            if (result) {
                setSuccess(true);
                clearCart();
                router.push(`/order/${result.orderId}`);
            }
           
        } catch (error) {
            setError(true);
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
        
        
        
       <div className="flex flex-col items-center"><Button type="submit" className="bg-blue-500 text-white w-full lg:w-[200px] h-[48px] hover:bg-blue-600" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
        "Создать заказ"
        }</Button>
        {error && <p className="text-red-500">Произошла ошибка при создании заказа.</p>}
        {success && <p className="text-green-500">Заказ успешно создан.</p>}
        </div>
      </form>
    </Form>
    );
}