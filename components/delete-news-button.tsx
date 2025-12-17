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
import { deleteNews } from "@/lib/actions/news";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteNewsButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteNews(id);
            setLoading(false);
            router.refresh();
            toast.success("Новость успешно удалена")
        } catch (error) {
            console.error("Error deleting news:", error);
            toast.error("Произошла неизвестная ошибка")
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="cursor-pointer bg-blue-600 text-white">
                    Удалить новость
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Вы уверены?</DialogTitle>
                    <DialogDescription>
                        Это действие не может быть отменено. Это будет навсегда удалить новость.
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