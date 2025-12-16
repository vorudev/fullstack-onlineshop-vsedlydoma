'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import type { Order } from "@/db/schema";
import { Star, Trash } from "lucide-react";
import { removeManufacturerFromProduct } from "@/lib/actions/product";
import { Check, X } from "lucide-react";

interface ApproveReviewButtonProps {
 productId: string
}

export function  SetManuNullButton({ productId }: ApproveReviewButtonProps) {
    const router = useRouter();
    return (
        <Button className="bg-red-500/80  hover:bg-red-800 text-white" onClick={() => removeManufacturerFromProduct(productId).then(() => router.refresh())}>
         <Trash className=" h-4 w-4 text-white " /> 
        </Button>
    );
}
