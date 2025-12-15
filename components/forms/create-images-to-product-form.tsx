'use client';
import { createProductAttribute, updateProductAttribute } from "@/lib/actions/attributes";
import { z } from "zod";
import { Link, Loader2, Upload } from "lucide-react";
import { productImages, type Product } from "@/db/schema";
import type { ProductImage } from "@/db/schema";
import { createImage } from "@/lib/actions/image-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
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
import { toast } from "sonner";

interface CreateImagesToProductFormProps {
  product: Product
  images?: ProductImage[]
}

const formSchema = z.object({
productId: z.string().uuid(),
  imageUrl: z.string().optional(),
  file: z.any().optional(),
  order: z.number().nullable(),
  isFeatured: z.boolean().nullable(),
  mode: z.enum(["url", "upload"]),
}).refine((data) => {
  if (data.mode === "url") {
    return data.imageUrl && data.imageUrl.length > 0;
  }
  if (data.mode === "upload") {
    return data.file !== undefined;
  }
  return false;
}, {
  message: "Please provide either an image URL or upload a file",
  path: ["imageUrl"],
})

export function CreateImagesToProductForm({ product, images }: CreateImagesToProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
      productId: product.id,
      order: null,
      isFeatured: false,
      mode: "upload",
    },
  })

  const mode = form.watch("mode")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      form.setValue("file", file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      if (values.mode === "upload" && selectedFile) {
        // Upload file
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("productId", values.productId)
        formData.append("order", values.order?.toString() || "0")
        formData.append("isFeatured", values.isFeatured?.toString() || "false")

        const res = await fetch("/api/products/images/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          throw new Error("Upload failed")
        }
      } else if (values.mode === "url" && values.imageUrl) {
        // Add URL
        const res = await fetch("/api/products/images/url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: values.productId,
            imageUrl: values.imageUrl,
            order: values.order || 0,
            isFeatured: values.isFeatured || false,
          }),
        })

        if (!res.ok) {
          throw new Error("Failed to add image")
        }
      }

      form.reset()
      toast.success("Фото успешно добавлено")
      setSelectedFile(null)
      setPreviewUrl(null)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(error as string)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <Tabs
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedFile(null)
                  setPreviewUrl(null)
                  form.setValue("imageUrl", "")
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Загрузить 
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Ссылкой
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <FormItem>
                    <FormLabel>Загрузить фото</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Загрузите фото с вашего устройства (максимум 5MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>

                  {previewUrl && (
                    <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Предпросмотр:</p>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-xs rounded-lg border"
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ссылка на фото</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Введите прямую ссылку на фото
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("imageUrl") && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Предпросмотр:</p>
                      <img
                        src={form.watch("imageUrl")}
                        alt="Preview"
                        className="max-w-xs rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Порядок</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value === null ? "" : field.value}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  disabled={isLoading}
                  placeholder="0"
                />
              </FormControl>
              <FormDescription>
                Порядок отображения (меньшие числа отображаются первыми)
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
                <FormLabel>Главное фото</FormLabel>
                <FormDescription>
                  Установить это как главное фото продукта
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading || (mode === "upload" && !selectedFile)}>
          {isLoading ? "Добавление..." : "Добавить фото"}
        </Button>
      </form>
    </Form>
  )
}