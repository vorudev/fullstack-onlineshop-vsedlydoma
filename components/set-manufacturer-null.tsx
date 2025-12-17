'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import type { Order } from "@/db/schema";
import { Star, Trash } from "lucide-react";
import { removeManufacturerFromProduct } from "@/lib/actions/product";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ApproveReviewButtonProps {
 productId: string
}

export function SetManuNullButton({ productId }: ApproveReviewButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleRemove = async () => {
        setIsLoading(true);
        try {
            const result = await removeManufacturerFromProduct(productId);
            
            if (result.success) {
                toast.success("Производитель удален", {
                    description: "Производитель успешно удален из продукта",
                });
                router.refresh();
            } else {
                // Обрабатываем разные типы ошибок
                const errorMessages: Record<string, string> = {
                    'Unauthorized': 'У вас нет прав для этого действия',
                    'Product not found': 'Продукт не найден',
                    'Cannot remove manufacturer from active product': 'Невозможно удалить производителя из активного продукта',
                    'Failed to remove manufacturer': 'Не удалось удалить производителя'
                };
                toast.error("Ошибка, Невозможно удалить производителя из активного продукта" );
            }
        } catch (error) {
            toast.error("Произошла ошибка", {
                description: "Попробуйте еще раз",
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button 
            className="bg-red-500/80 hover:bg-red-800 text-white" 
            onClick={handleRemove}
            disabled={isLoading}
        >
            <Trash className="h-4 w-4 text-white" /> 
        </Button>
    );
}