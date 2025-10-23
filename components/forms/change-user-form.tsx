'use client';
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { updateUser } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button"
import { User } from "@/db/schema";
import { Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
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

interface ChangeUserFormProps {
    user: Omit<User, "createdAt" | "updatedAt" | "emailVerified" | "image" >;
}
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",

  }),
email: z.string().email({ 
        message: "Invalid email address."
     }),
role: z.enum(["user", "admin"], {
    message: "Role must be user or admin.",
}),
banned: z.boolean().optional(),
});

export function ChangeUserForm({ user }: ChangeUserFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            role: user.role || "user",
            banned: user.banned || false,
        },
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const userData = { 
                ...values,
            } 
            if (user) { 
                await updateUser(user.id, userData);
            } else {
                throw new Error("User not found");
            }
            form.reset();
            setIsLoading(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to update user:", error);
            setIsLoading(false);
        }
            
            
            
    }
    return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
        <FormField
          control={form.control}
            name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="User name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
            name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="User email"  type="email" {...field} 
                 />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                     <FormField
    control={form.control}
    name="role"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Роль</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Изменить роль" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
    )}
/>

       
       

      


        

        
        
       <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
"Update User"
        }</Button>
      </form>
    </Form>
    );
}