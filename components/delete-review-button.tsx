'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { deleteReview} from "@/lib/actions/reviews";
import { Trash } from "lucide-react";

interface ApproveReviewButtonProps {
    reviewId: string;
}

export function DeleteReviewButton({ reviewId }: ApproveReviewButtonProps) {
    const router = useRouter();
    return (
        <Button variant="ghost" onClick={() => deleteReview(reviewId) .then(() => router.refresh())}>
            <Trash className="h-4 w-4 text-red-600 hover:text-red-700" />
        </Button>
    );
}