'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import type { Order } from "@/db/schema";
import { Star } from "lucide-react";
import { setFeaturedImage } from "@/lib/actions/image-actions";
import { Check, X } from "lucide-react";

interface ApproveReviewButtonProps {
 imageId: string
}

export function  SetFeaturedButton({ imageId }: ApproveReviewButtonProps) {
    const router = useRouter();
    return (
        <Button className="bg-green-500/80 absolute top-2 left-2 hover:bg-green-800 text-white" onClick={() => setFeaturedImage(imageId).then(() => router.refresh())}>
         <Star className=" h-4 w-4 text-white " /> 
        </Button>
    );
}
