'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
import { authClient } from "@/lib/auth-client";
 
const formSchema = z.object({
  email: z.string().email(),
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
   
    },
  });


 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
const { error } = await authClient.forgetPassword({
  email: values.email,
  redirectTo: "/reset-password",
});
    if (error) {
      setError("Произошла ошибка");
     
    } else {
      setSuccess("Письмо отправлено");
      setTimeout(() => {
        router.push("/reset-password");
      }, 500);
    }
    setIsLoading(false);
  }
  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="bg-white border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-black">Восстановление пароля</CardTitle>
          <CardDescription className="text-gray-600">
            Введите ваш email для восстановления пароля
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              
              
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
             
              <FormControl>
                <input placeholder="Email" {...field} className="bg-gray-100 border border-gray-200 py-3 focus:outline-none focus:ring-blue-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600"/>
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
                </div>
               
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white w-full h-[48px] text-[12px] uppercase" disabled={isLoading} >

             {isLoading ? <Loader2Icon className="size-4 animate-spin"></Loader2Icon> : "Подтвердить" }
                </Button>
                {error && <p className="text-red-500 text-center text-xs">{error}</p>}
                {success && <p className="text-green-500 text-center text-xs">{success}</p>}
              </div>
              <div className="text-center text-sm text-black">
                Нет аккаунта?{" "}
                <Link href="/signup" className="underline text-blue-500 underline-offset-4">
                  Зарегистрироваться
                </Link>
              </div>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Нажимая на кнопку "Подтвердить", вы соглашаетесь с
        <a href="# " className="underline text-blue-500 underline-offset-4">Политикой конфиденциальности</a>.
      </div>
    </div>
  )
}