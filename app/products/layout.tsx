
import Header from "@/components/frontend/header";
import { Suspense } from "react";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Footer from "@/components/frontend/footer";
import { getContactUs } from "@/lib/actions/contact-us";

export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
    const contacts = await getContactUs()
    return (
        <>
            <Header contacts={contacts} />

            <main className="min-h-screen bg-gray-100">
            {children}
            <Footer contacts={contacts} />
<NavMenuMobile />
</main>
        </>
    );
}
