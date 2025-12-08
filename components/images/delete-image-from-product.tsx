'use client'

import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { deleteProductImage } from "@/lib/actions/image-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/db/schema";

export function DeleteImageFromProductButton({ image }: { image: Omit<ProductImage, "createdAt" | "updatedAt"> }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        try {
           const res = await fetch(`/api/products/images/${image.id}`, {
               method: "DELETE",
                
           })
           if (res.ok) {
               router.refresh();
           }

        } catch (error) {
            console.error("Error deleting image:", error);
        } finally {
            
            setLoading(false);
        }
    } 

    return (
        <Dialog>
            <DialogTrigger asChild className="absolute top-2 right-2">
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open</span>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Вы уверены?</DialogTitle>
                    <DialogDescription>
                        Это действие не может быть отменено. Это будет навсегда удалить изображение.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-end gap-2">
                    <DialogTrigger asChild>
                        <Button variant="ghost">Отмена</Button>
                    </DialogTrigger>
                    <Button
                        disabled={loading}
                        onClick={handleDelete}
                        variant="destructive"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Удалить
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}