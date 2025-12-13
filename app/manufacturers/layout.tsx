import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import { getContactUs } from "@/lib/actions/contact-us";
import Footer from "@/components/frontend/footer";
export default async function ManufacturersLayout({ children }: { children: React.ReactNode }) {
    const contacts = await getContactUs()
    return (
    <>

    <Header contacts={contacts} />

    <div className="bg-gray-100 ">
           
            {children}
        
    <NavMenuMobile />
    <Footer  contacts={contacts}/>
    </div>
</>
    )
}


