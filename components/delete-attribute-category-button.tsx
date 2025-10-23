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
import { deleteAttributeCategory } from "@/lib/actions/attributes-categories";
import { useState } from "react";
import { useRouter } from "next/navigation";
interface DeleteAttributeCategoryButtonProps {
    categoryId: string;
}
export default function DeleteAttributeCategoryButton({ categoryId }: DeleteAttributeCategoryButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await deleteAttributeCategory(categoryId);
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error deleting attribute category:", error);
        } finally {
            setIsLoading(false);
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
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the attribute category from the database.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end">
                    <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}