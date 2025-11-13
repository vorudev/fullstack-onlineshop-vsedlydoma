import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import { Suspense } from "react";
export default function ManufacturersLayout({ children }: { children: React.ReactNode }) {
    return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
    <Header />
    </Suspense>
    <div className="bg-gray-100 ">
           
            {children}
        </div>
    <NavMenuMobile />
</>
    )
}


