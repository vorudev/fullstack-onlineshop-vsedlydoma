import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            
            {children}
            <NavMenuMobile />
        </>
    );
}
