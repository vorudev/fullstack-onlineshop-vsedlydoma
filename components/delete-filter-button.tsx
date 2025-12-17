'use client';
import { Button } from "@/components/ui/button";
import { deleteFilter } from "@/lib/actions/filters";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteFilterButtonProps {
    filterId: string;
}

export function DeleteFilterButton({ filterId }: DeleteFilterButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    async function handleDelete() {
        setIsLoading(true);
        try {
            await deleteFilter(filterId);
            setIsLoading(false);
            toast.success("Фильтр успешно удален")
            router.refresh()
        } catch (error) {
            console.error("Error deleting filter:", error);
            toast.error("Произошла неизвестная ошибка")
            setIsLoading(false);
        }
    }
    return (
        <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Удалить
        </Button>
    );
}

