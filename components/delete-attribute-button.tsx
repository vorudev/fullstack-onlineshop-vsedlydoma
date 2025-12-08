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
import { deleteProductAttribute } from "@/lib/actions/attributes";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteAttributeButtonProps {
    attributeId: string;
}

export default function DeleteAttributeButton({ attributeId }: DeleteAttributeButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await deleteProductAttribute(attributeId);
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error deleting attribute:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button  variant="ghost">
                    <Trash2 className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удалить характеристику?</DialogTitle>
                    <DialogDescription>
                        Это действие не может быть отменено. Это будет навсегда удалить характеристику из базы данных.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end">
                    <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading}>
                        Отмена
                    </Button>
                    <Button onClick={handleDelete} variant="destructive" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : "Удалить"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}