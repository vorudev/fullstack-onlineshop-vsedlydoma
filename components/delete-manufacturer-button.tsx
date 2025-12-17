'use client';

import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { deleteManufacturer } from "@/lib/actions/manufacturer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteManufacturerButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteManufacturer(id);
            setLoading(false);
          
            router.refresh();
            toast.success("Производитель успешно удален")
        } catch (error) {
            console.error("Error deleting manufacturer:", error);
            toast.error("Произошла неизвестная ошибка")
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <Trash2 className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Вы уверенны?</DialogTitle>
                    <DialogDescription>
                        Это действие навсегда удалит производителя с базы данных
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                    <DialogTrigger asChild>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            Отмена
                        </Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "Удалить"
                            )}
                        </Button>
                    </DialogTrigger>
                </div>
            </DialogContent>
        </Dialog>
    );
}