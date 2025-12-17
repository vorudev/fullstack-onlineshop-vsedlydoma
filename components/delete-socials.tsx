'use client';
import { deleteContactTelephone } from "@/lib/actions/contact-us-telephones";
import { DialogContent, DialogTrigger, Dialog, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteContactPhone } from "@/lib/actions/contact-us-phones";
import { toast } from "sonner";

export function DeleteTelephoneButton({ id }: { id: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await deleteContactTelephone(id);
            setIsOpen(false);
            toast.success("Телефон успешно удален")
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
                <Button variant="destructive" className=" ">
                    <Trash2 className="size-4" /> 
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удалить телефон?</DialogTitle>
                    <DialogDescription>
                        Это действие не может быть отменено. Это будет навсегда удалит телефон из базы данных.
                    </DialogDescription>
                </DialogHeader>
                <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Удалить"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}



export function DeleteSocialsButton({ id }: { id: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await deleteContactPhone(id);
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error deleting telephone:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className=" ">
                    <Trash2 className="size-4" /> 
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удалить соцсеть?</DialogTitle>
                    <DialogDescription>
                        Это действие не может быть отменено. Это будет навсегда удалит телефон из базы данных.
                    </DialogDescription>
                </DialogHeader>
                <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Удалить"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}