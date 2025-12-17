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
import { deleteAdminEmail } from "@/lib/actions/admin";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteAdminEmailButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteAdminEmail(id);
            setLoading(false);
            router.refresh();
            toast.success("Почта успешно удалена")
        } catch (error) {
            toast.error("Произошла ошибка")
            console.error("Error deleting admin email:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="cursor-pointer text-red-500">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Вы уверены?</DialogTitle>
                    <DialogDescription>
                        Это действие не может быть отменено. Это будет навсегда удалить email.
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