'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { deleteReview} from "@/lib/actions/reviews";

interface ApproveReviewButtonProps {
    reviewId: string;
}

export function DeleteReviewButton({ reviewId }: ApproveReviewButtonProps) {
    const router = useRouter();
    return (
        <Button onClick={() => deleteReview(reviewId) .then(() => router.refresh())}>
           Удалить
        </Button>
    );
}