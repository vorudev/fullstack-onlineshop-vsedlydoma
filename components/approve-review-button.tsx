'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { updateReview } from "@/lib/actions/reviews";
import { Check } from "lucide-react";

interface ApproveReviewButtonProps {
    reviewId: string;
}

export function ApproveReviewButton({ reviewId }: ApproveReviewButtonProps) {
    const router = useRouter();
    return (
        <Button variant="ghost" onClick={() => updateReview(reviewId, { status: 'approved' }) .then(() => router.refresh())}>
            <Check className=" h-4 w-4 text-green-600 hover:text-green-700" />
        </Button>
    );
}