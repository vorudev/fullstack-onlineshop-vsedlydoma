'use client';
import { createProductAttribute, updateProductAttribute } from "@/lib/actions/attributes";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { productImages, type Product } from "@/db/schema";
import type { ProductImage } from "@/db/schema";
import { createImage } from "@/lib/actions/image-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import type { AttributeCategory } from "@/db/schema";
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
import { or } from "drizzle-orm";

interface CreateImagesToProductFormProps {
  product: Product
  images?: ProductImage[]
}

const formSchema = z.object({
  imageUrl: z.string().min(1),
  productId: z.string().uuid(),
  order: z.number().nullable(),
  isFeatured: z.boolean().nullable(),

})

export function CreateImagesToProductForm({ product, images }: CreateImagesToProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
      productId: product.id, 
      order: null,
      isFeatured: false
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await createImage(values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

return ( 
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  {...field} 
                  disabled={isLoading} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  value={field.value === null ? "" : field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  disabled={isLoading} 
                />
              </FormControl>
              <FormDescription>
                Display order (lower numbers appear first)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Featured Image
                </FormLabel>
                <FormDescription>
                  Set this as the main product image
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Image"}
        </Button>
      </form>
    </Form>
  )
}
