'use client';
import { deleteFilterCategory } from "@/lib/actions/filter-categories";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
interface DeleteFilterCategoryButtonProps {
    categoryId: string;
}
export function DeleteFilterCategoryButton({ categoryId }: DeleteFilterCategoryButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
        const router = useRouter();
    async function handleDelete() {
        setIsLoading(true);
        try {
            await deleteFilterCategory(categoryId);
            setIsLoading(false);
            router.refresh();
        } catch (error) {
            console.error("Error deleting filter category:", error);
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
