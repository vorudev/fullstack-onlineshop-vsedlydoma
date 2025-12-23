'use client'
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDollarRate, createDollarRate } from "@/lib/actions/currency";
import { about, About } from "@/db/schema";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DollarRate } from "@/db/schema";
import { Input } from "@/components/ui/input";
interface CurrencyFormProps {
    dollarRate?: DollarRate | null
}

const aboutSchema = z.object({
    value: z.number(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export function AddDollarRate({ dollarRate}: CurrencyFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AboutFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues: {
            value: dollarRate?.value || 0 ,
        },
    });

    async function onSubmit(values: AboutFormValues) {
        setIsLoading(true);
        try {
            if (dollarRate) {
               await updateDollarRate({
                ...values,
                id: dollarRate?.id
            })
            toast.success("Информация успешно добавлена")
            } else 
            {
                await createDollarRate({
                    ...values
                })
                toast.success("Информация успешно добавлена")
            }
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
  name="value"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Цена (USD)</FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder="0"
          {...field}
          value={field.value ?? ''}

          onChange={(e) => {
            const value = e.target.value;
            field.onChange(value === '' ? '' : Number(value));
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

                {/* Description */}
               
               

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Сохранить
                </Button>
            </form>
        </Form>
    );
}
