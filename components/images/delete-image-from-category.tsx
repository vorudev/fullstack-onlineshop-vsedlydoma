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
import { CategoryImage } from "@/db/schema";

export function DeleteImageFromCategoryButton({ image }: { image: Omit<CategoryImage, "createdAt" | "updatedAt"> }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
           const res = await fetch(`/api/categories/images/${image.id}`, {
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
        <Dialog >
            <DialogTrigger asChild className="">
                <Button variant="outline" className="">
                    <span className="sr-only">Open</span>
                    Удалить изображение <Trash2 className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Вы уверены?</DialogTitle>
                    <DialogDescription>
                        Это действие невозможно отменить, это навсегла удалит картинку из базы данных 
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-end gap-2">
                    <DialogTrigger asChild>
                        <Button variant="ghost">Отменить</Button>
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