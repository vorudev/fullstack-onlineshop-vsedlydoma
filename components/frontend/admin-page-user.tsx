'use client';
import  { useSession } from "@/lib/auth-client";

export default function AdminPageUser() {
    const { data: session } = useSession();
    return (
        <div className="px-4 py-2 flex flex-col gap-1 hover:bg-neutral-900">
            <p className="font-semibold">{session?.user?.name}</p>
            <p className="text-xs">{session?.user?.email}</p>
        </div>
    );
}
