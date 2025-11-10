
import Header from "@/components/frontend/header";
import { Suspense } from "react";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
            <Header />
            </Suspense>
            <main className="min-h-screen bg-gray-100">{children}</main>
        </>
    );
}
