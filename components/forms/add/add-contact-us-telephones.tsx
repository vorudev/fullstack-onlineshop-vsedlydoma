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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
interface AboutFormProps {
    contactTelephone?: ContactTelephone | null
    contactUsId: string | null 
}

const aboutSchema = z.object({
    phone: z.string()
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
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export function AddContactUsTelephone({ contactTelephone, contactUsId }: AboutFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
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
                toast.success("Информация успешно добавлена")
            } else {
            createContactTelephone(
                {
                    ...values,
                    contactUsId: contactUsId,
                }
            );
            toast.success("Информация успешно добавлена")
            }
            form.reset();
            setIsLoading(false);
            router.refresh();
        } catch (error) {
          toast.error("Произошла ошибка")
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
                                <Input onChange={(e) => field.onChange(formatPhoneInput(e.target.value))} value={formatPhoneInput(field.value)} onFocus={(e) => {
            // Если поле пустое при фокусе, устанавливаем 375
            if (!e.target.value || e.target.value === '') {
              field.onChange('+ 375');
            }
          }} 
                                placeholder="Введите телефон"  />
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
