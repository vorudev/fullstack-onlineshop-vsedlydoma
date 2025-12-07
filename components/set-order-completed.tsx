'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import type { Order } from "@/db/schema";
import { updateOrder } from "@/lib/actions/orders";
import { Check, X } from "lucide-react";

interface ApproveReviewButtonProps {
 order: Omit<Order, "status">
}

export function  SetOrderCompButton({ order }: ApproveReviewButtonProps) {
    const router = useRouter();
    return (
        <Button className="bg-green-500/80 hover:bg-green-800 text-white" onClick={() => updateOrder({
            ...order,
            status: "completed"
        }).then(() => router.refresh())}>
           Заказ выполнен <Check className=" h-4 w-4 text-white " /> 
        </Button>
    );
}
export function SetOrderCancButton({order}: ApproveReviewButtonProps) {
    const router = useRouter();
    return (
        <Button variant='destructive' onClick={() => updateOrder({
            ...order,
            status: "cancelled"
        }).then(() => router.refresh())}>
           Заказ отменен <X className=" h-4 w-4 text-white " /> 
        </Button>
    );
}