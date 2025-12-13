import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import NavbarCart from "./navbar-cart";
import { getContactUs } from "@/lib/actions/contact-us";
import Footer from "@/components/frontend/footer";
export default async function CartLayout({ children }: { children: React.ReactNode }) {
    const contacts = await getContactUs()
    return (
        <>

            <Header  contacts={contacts}/>

            <main className="bg-gray-100 ">
            {children}
            <NavMenuMobile />
           
             <Footer  contacts={contacts}/>
            </main>
        </>
    );
}
