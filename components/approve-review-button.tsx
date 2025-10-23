'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { updateReview } from "@/lib/actions/reviews";

interface ApproveReviewButtonProps {
    reviewId: string;
}

export function ApproveReviewButton({ reviewId }: ApproveReviewButtonProps) {
    const router = useRouter();
    return (
        <Button onClick={() => updateReview(reviewId, { status: 'approved' }) .then(() => router.refresh())}>
            Подтвердить
        </Button>
    );
}