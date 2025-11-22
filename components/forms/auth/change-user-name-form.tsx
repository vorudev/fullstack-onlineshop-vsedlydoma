'use client';
import { useState } from "react";
import { Loader2, Loader2Icon } from "lucide-react";
import { updateUserName } from "@/lib/actions/users";
import { Button } from "@/components/ui/button"
import { User } from "@/db/schema";
import { Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
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
import { set, z } from "zod"

interface ChangeUserNameFormProps {
    name: string;
}
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Имя должно содержать не менее 2 символов",
    }),
});

export function ChangeUserNameForm({ name }: ChangeUserNameFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name || "",
        },
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const {data, error} = await authClient.updateUser({
            name: values.name,
        })
        
        if (data) {
            setMessage("Имя успешно изменено");
           
            router.refresh();
        } else {
            setErrorMessage("Ошибка при изменении имени");
           
        }
    } catch (error) {
        console.error("Failed to update user:", error);
       
    } finally {
        setIsLoading(false);
    }
}
    return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
            name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="User name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full pt-4"><Button type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white w-full h-[48px] text-[12px] uppercase " disabled={isLoading} >

             {isLoading ? <Loader2Icon className="size-4 animate-spin"></Loader2Icon> : "Изменить имя"}
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
    );
}