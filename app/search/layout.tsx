import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import { Suspense } from "react";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
             <Suspense fallback={<div>loading</div>}>
             <Header />
             </Suspense>
           
            {children}
             <NavMenuMobile />
        </>
    );
}
