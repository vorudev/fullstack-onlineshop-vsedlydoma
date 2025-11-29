'use client';
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
import { deleteCategory } from "@/lib/actions/product-categories";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteCategoryButtonProps {
  categoryId: string;
}

export default function DeleteCategoryButton({ categoryId }: DeleteCategoryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteCategory(categoryId);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting category:", error);
      router.refresh();
      setIsOpen(false)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вы уверены?</DialogTitle>
          <DialogDescription>
            Это действие не может быть отменено. Это будет навсегда удалить категорию из базы данных. Связанные с ней товары будут без категории
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={handleDelete} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Удалить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}