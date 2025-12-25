'use client';

import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { translateError } from "../toast-helper";
import { toast } from "sonner";

import { Textarea } from "../ui/textarea";
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
    priceRegional: number | null;
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
  customerPhone: z
  .string()
  .min(1, 'Номер телефона обязателен')
  .trim()
  // Удаляем пробелы, дефисы, скобки для проверки
  .transform((val) => val.replace(/[\s\-()]/g, ''))
  // Базовая санитизация на клиенте
  .transform((val) => val.replace(/[<>{}[\]\\'"`;]/g, ''))
  // Проверка минимальной длины
  .refine(
    (val) => val.length >= 9,
    'Номер телефона слишком короткий'
  )
  // Проверка максимальной длины
  .refine(
    (val) => val.length <= 20,
    'Номер телефона слишком длинный'
  )
  // Проверка что содержит только допустимые символы
  .refine(
    (val) => /^[+]?[0-9]+$/.test(val),
    'Номер может содержать только цифры и знак +'
  )
  // Проверка белорусского формата
  .refine(
    (val) => {
      // Нормализуем номер
      let normalized = val;
      if (normalized.startsWith('8')) {
        normalized = '+375' + normalized.slice(1);
      } else if (normalized.startsWith('375')) {
        normalized = '+' + normalized;
      }
      // Проверяем формат +375XXXXXXXXX
      return /^\+375(25|29|33|44)\d{7}$/.test(normalized);
    },
    'Неверный формат. Пример: +375 29 123-45-67'
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
    const { cart, clearCart, } = useCart();
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
            price: item.product.priceRegional ? item.product.priceRegional : item.product.price,
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
                toast.success('Заказ успешно оформлен');
                router.push(`/order/${result.orderId}`);
            }
           
        } catch (error) {
            setError(true);
            toast.error(error as string);
            // Показать error message
        } finally {
            setIsLoading(false);
        }
    }
     const formatPhoneInput = (value: string) => {
    // Удаляем все кроме цифр и +
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // Ограничиваем длину
    if (cleaned.length > 13) {
      cleaned = cleaned.slice(0, 13);
    }

    // Форматируем в процессе ввода
    if (cleaned.startsWith('+375')) {
      const digits = cleaned.slice(4);
      if (digits.length <= 2) {
        return `+375 ${digits}`;
      } else if (digits.length <= 5) {
        return `+375 ${digits.slice(0, 2)} ${digits.slice(2)}`;
      } else if (digits.length <= 7) {
        return `+375 ${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(5)}`;
      } else {
        return `+375 ${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7)}`;
      }
    }

    return cleaned;
  };
    
    return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 ">
        <div className="grid md:grid-cols-2 items-start  gap-4 ">
        <FormField
          control={form.control}
            name="customerName"
          render={({ field }) => (
            <FormItem >
              <FormLabel>Имя *</FormLabel>
              <FormControl className=" border border-gray-300 rounded-md h-12 py-0   ">
           
                <input placeholder="Иван Иванов" className="bg-white border border-gray-200 py-3 focus:outline-none focus:ring-blue-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600" {...field}  />
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
              <FormLabel>Почта *</FormLabel>
              <FormControl className=" border border-gray-300 rounded-md h-12 py-0   ">
                <input placeholder="example@gmail.com" className="bg-white border border-gray-200 py-3 focus:outline-none focus:ring-blue-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600" type="email" {...field} />
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
              <FormLabel>Номер телефона *</FormLabel>
              <FormControl className=" border border-gray-300 rounded-md h-12 py-0   ">
                        <input {...field } onChange={(e) => field.onChange(formatPhoneInput(e.target.value))} value={formatPhoneInput(field.value)} onFocus={(e) => {
            // Если поле пустое при фокусе, устанавливаем 375
            if (!e.target.value || e.target.value === '') {
              field.onChange('+ 375');
            }
          }} className="bg-white border border-gray-200 py-3 focus:outline-none focus:ring-blue-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600"/>

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
        <textarea
          {...field}
          value={field.value ?? ""}
          placeholder="Заметки к заказу"
          rows={1}
          className="bg-white border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          // ↑ resize-y позволяет пользователю растягивать вертикально
        />
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