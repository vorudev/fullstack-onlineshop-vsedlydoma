'use client';
import { synchronizeCurrency } from "@/lib/actions/currency";
import { DialogContent, DialogTrigger, Dialog, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteContactPhone } from "@/lib/actions/contact-us-phones";
import { toast } from "sonner";

export function SyncCurrencyButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await synchronizeCurrency();
            setIsOpen(false);
            toast.success("Синхронизировано успешно")
            router.refresh();
        } catch (error) {
            console.error("Error deleting telephone:", error);
            toast.error("Произошла неизвестная ошибка")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className=" ">
                    Синхронизировать
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Синхронизировать цены</DialogTitle>
                    <DialogDescription>
                        Это действие не может быть отменено.
                    </DialogDescription>
                </DialogHeader>
                <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Синхронизировать"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}

