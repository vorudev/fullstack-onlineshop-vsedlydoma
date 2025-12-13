import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Footer from "@/components/frontend/footer";
import { getContactUs } from "@/lib/actions/contact-us";
export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
    const contacts = await getContactUs()
    return (
        <>
   <main className="bg-gray-100 lg:bg-white "> 
            <Header  contacts={contacts} /> 

            {children}
            <NavMenuMobile />
            <Footer contacts={contacts} />
            </main>
        </>
    );
}