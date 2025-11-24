 'use client'
 import z from "zod"
 import { useForm } from "react-hook-form"
 import { zodResolver } from "@hookform/resolvers/zod"
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
 import { Input } from "@/components/ui/input"
 import { Button } from "@/components/ui/button"
 import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
 import { useState } from "react"
 import { useRouter } from "next/navigation"

 import { updatePhoneNumber } from "@/lib/actions/users"
 import { toast } from "sonner"
 import { Loader2Icon } from "lucide-react"
 
const belarusPhoneClientSchema = z
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
  );

const formSchema = z.object({
  phoneNumber: belarusPhoneClientSchema,
});

 export default function AddPhoneToUser() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phoneNumber: "",
        },
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            await updatePhoneNumber(values.phoneNumber)
            setMessage("Телефон успешно добавлен")
            router.refresh()
        } catch (error) {
            const e = error as Error
            setErrorMessage("Ошибка при добавлении номера")
        } finally {
            setIsLoading(false)
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <input {...field } onChange={(e) => field.onChange(formatPhoneInput(e.target.value))} value={formatPhoneInput(field.value)} onFocus={(e) => {
            // Если поле пустое при фокусе, устанавливаем 375
            if (!e.target.value || e.target.value === '') {
              field.onChange('+ 375');
            }
          }} 
          className="bg-gray-100 border border-gray-200 py-3 focus:outline-none focus:ring-blue-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600"/>
                            </FormControl>
                            <FormDescription>
                                Введите ваш номер телефона
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
               <div className="w-full pt-4"><Button type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white w-full h-[48px] text-[12px] uppercase " disabled={isLoading} >

             {isLoading ? <Loader2Icon className="size-4 animate-spin"></Loader2Icon> : "Добавить номер"}
                </Button>
                {message && (
        <p className="text-green-500 mt-2 text-sm">{message}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
      )}
      </div>
            </form>
        </Form>
    )
}