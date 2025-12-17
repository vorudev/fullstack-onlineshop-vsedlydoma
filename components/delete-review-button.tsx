'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { deleteReview} from "@/lib/actions/reviews";
import { Trash } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";


interface ApproveReviewButtonProps {
    reviewId: string;
}
export function DeleteReviewButton({ reviewId }: ApproveReviewButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteReview(reviewId);
            
            toast.success("Отзыв удален", {
                description: "Отзыв был успешно удален",
            });
            
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("Ошибка при удалении отзыва", {
                description: "Попробуйте еще раз",
            });
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <Trash className="h-4 w-4 text-red-600 hover:text-red-700" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Вы уверены?</DialogTitle>
                    <DialogDescription>
                        Это действие не может быть отменено. Отзыв будет удален навсегда.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                    <Button 
                        variant="ghost" 
                        onClick={() => setOpen(false)}
                        disabled={isDeleting}
                    >
                        Отмена
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Удаление..." : "Удалить"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}