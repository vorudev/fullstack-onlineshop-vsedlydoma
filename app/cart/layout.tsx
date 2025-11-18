import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import { Suspense } from "react";
import NavbarCart from "./navbar-cart";

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
            <Header />
            </Suspense>
            
            {children}
            <NavMenuMobile />
            <NavbarCart />
        </>
    );
}
