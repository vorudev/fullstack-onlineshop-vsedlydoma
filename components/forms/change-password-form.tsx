
'use client';
import {useState} from "react";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { signIn, signUp } from "@/lib/actions/users"

import { z } from "zod"
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

 const formSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  currentPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"], // This sets the error on confirmPassword field
})

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      currentPassword: "",
    },
  });
    
  // 2. Define a submit handler.
  
 async function onSubmit(values: z.infer<typeof formSchema>) {
  setIsLoading(true);
const { error } = await authClient.changePassword({
  newPassword: values.password,
  currentPassword: values.currentPassword,
});
if (error) {
  toast.error(error.message);
 } else {
  console.log("Password changed successfully");
 }
 setIsLoading(false);
}
return ( 
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-3 w-full">
            <div className="grid gap-6">    
                <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Текущий пароль</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Новый пароль</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подтвердите новый пароль</FormLabel>
              <FormControl>
                <Input type="password" {...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            </div>
            <Button type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white w-full h-[48px] text-[12px] uppercase " disabled={isLoading} >

             {isLoading ? <Loader2Icon className="size-4 animate-spin"></Loader2Icon> : "Изменить пароль"}
                </Button>
        </form>
    </Form>
)
}