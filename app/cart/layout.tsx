import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import NavbarCart from "./navbar-cart";
import Footer from "@/components/frontend/footer";
export default function CartLayout({ children }: { children: React.ReactNode }) {
    return (
        <>

            <Header />

            <main className="bg-gray-100 ">
            {children}
            <NavMenuMobile />
            <NavbarCart />
             <Footer />
            </main>
        </>
    );
}
