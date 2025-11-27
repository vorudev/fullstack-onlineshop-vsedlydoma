import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";

import Footer from "@/components/frontend/footer";
export default function ManufacturersLayout({ children }: { children: React.ReactNode }) {
    return (
    <>

    <Header />

    <div className="bg-gray-100 ">
           
            {children}
        
    <NavMenuMobile />
    <Footer />
    </div>
</>
    )
}


