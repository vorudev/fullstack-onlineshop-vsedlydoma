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
 
 const formSchema = z.object({
    phoneNumber: z.string().min(10).max(15),
 })
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
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Номер телефона</FormLabel>
                            <FormControl>
                                <Input {...field} />
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