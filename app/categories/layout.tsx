import { Suspense } from "react";
import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
    return (
    <>
<Suspense fallback={<div>Loading...</div>}>
    <Header />
    <div className="bg-gray-100">
           
            {children}
        </div>
    <NavMenuMobile />
</Suspense>
    </>
)}