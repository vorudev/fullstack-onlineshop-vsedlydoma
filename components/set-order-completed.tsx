'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import type { Order } from "@/db/schema";
import { updateOrder } from "@/lib/actions/orders";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface ApproveReviewButtonProps {
 order: Omit<Order, "status">
}

export function  SetOrderCompButton({ order }: ApproveReviewButtonProps) {
    const router = useRouter();
    return (
        <Button 
        className="bg-green-500/80 hover:bg-green-800 text-white" 
        onClick={async () => {
          try {
            await updateOrder({
              ...order,
              status: "completed"
            });
            
            toast.success("Заказ успешно выполнен!", {
              description: `Заказ #${order.id} отмечен как выполненный`,
            });
            
            router.refresh();
          } catch (error) {
            toast.error("Ошибка при обновлении заказа", {
              description: "Попробуйте еще раз",
            });
            console.error(error);
          }
        }}
      >
        Заказ выполнен <Check className="h-4 w-4 text-white" /> 
      </Button>
    );
}
export function SetOrderCancButton({order}: ApproveReviewButtonProps) {
    const router = useRouter();
    return (
        <Button 
  variant='destructive' 
  onClick={async () => {
    try {
      await updateOrder({
        ...order,
        status: "cancelled"
      });
      
      toast.success("Заказ отменен", {
        description: `Заказ #${order.id} успешно отменен`,
      });
      
      router.refresh();
    } catch (error) {
      toast.error("Ошибка при отмене заказа", {
        description: "Попробуйте еще раз",
      });
      console.error(error);
    }
  }}
>
  Заказ отменен <X className="h-4 w-4 text-white" /> 
</Button>
    );
}