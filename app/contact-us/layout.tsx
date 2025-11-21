import { Suspense } from "react";
import Header from "@/components/frontend/header";
import {getContactUs} from "@/lib/actions/contact-us";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";

export default function CategoryLayout({ children }: { children: React.ReactNode }) {

    return (
    <>
<Suspense fallback={<div>Loading...</div>}>
    <Header />
           
            {children}

    <NavMenuMobile />
</Suspense>
    </>
)}