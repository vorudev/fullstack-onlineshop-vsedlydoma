
import Header from "@/components/frontend/header";
import { Suspense } from "react";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Footer from "@/components/frontend/footer";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />

            <main className="min-h-screen bg-gray-100">
            {children}
            <Footer />
<NavMenuMobile />
</main>
        </>
    );
}
