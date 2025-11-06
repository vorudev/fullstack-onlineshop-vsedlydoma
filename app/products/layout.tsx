
import Header from "@/components/frontend/header";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-100">{children}</main>
        </>
    );
}
