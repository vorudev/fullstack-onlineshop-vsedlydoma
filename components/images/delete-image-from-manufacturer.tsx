'use client'

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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ManufacturerImage } from "@/db/schema";

export function DeleteImageFromManufacturerButton({ image }: { image: Omit<ManufacturerImage, "createdAt" | "updatedAt"> }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
           const res = await fetch(`/api/manufacturers/images/${image.id}`, {
               method: "DELETE",
                
           })
           if (res.ok) {
               router.refresh();
           }

        } catch (error) {
            console.error("Error deleting image:", error);
        } finally {
            setLoading(false);
        }
    } 

    return (
        <Dialog>
            <DialogTrigger asChild className="absolute top-2 right-2">
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open</span>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the image.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-end gap-2">
                    <DialogTrigger asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogTrigger>
                    <Button
                        disabled={loading}
                        onClick={handleDelete}
                        variant="destructive"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}