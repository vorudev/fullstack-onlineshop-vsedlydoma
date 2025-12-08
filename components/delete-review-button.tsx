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


interface ApproveReviewButtonProps {
    reviewId: string;
}

export function DeleteReviewButton({ reviewId }: ApproveReviewButtonProps) {
    const router = useRouter();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <Trash className="h-4 w-4 text-red-600 hover:text-red-700" />
                </Button>
            </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Вы уверены?</DialogTitle>
                <DialogDescription>
                    Это действие не может быть отменено. Это будет навсегда удалить отзыв.
                </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                    <Button variant="ghost">Отмена</Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                    <Button variant="destructive" onClick={() => deleteReview(reviewId).then(() => router.refresh())}>Удалить</Button>
                </DialogTrigger>
            </div>
        </DialogContent>
        </Dialog>
    );
}