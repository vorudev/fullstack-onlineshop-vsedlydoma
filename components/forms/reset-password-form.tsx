'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
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
 password: z.string().min(8),
confirmPassword: z.string().min(8),
 
})

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") as string;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
   
    },
  });


 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
const { error } = await authClient.resetPassword({
  newPassword: values.password,
token, 
});
    if (error) {
      toast.error(error.message);
     
    } else {
      toast.success("Password reset successfully");
      router.push("/signin");
    }
    setIsLoading(false);
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your new password" {...field} type="password"/>
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
                </div>
                <div className="grid gap-3">
                  <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="Confirm your new password" {...field} type="password"/>
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
                </div>
                <div className="grid gap-3">
                  
                  
                </div>
                <Button type="submit" className="bg-[rgb(35,25,22)] text-[rgb(228,224,212)] w-full h-[48px] bdog text-[12px] uppercase " disabled={isLoading} >

             {isLoading ? <Loader2Icon className="size-4 animate-spin"></Loader2Icon> : "Continue"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}