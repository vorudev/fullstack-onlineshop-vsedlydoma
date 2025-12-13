import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Footer from "@/components/frontend/footer";
import Header from "@/components/frontend/header";
import { getContactUs } from "@/lib/actions/contact-us";
export default async function MenuLayout({ children }: { children: React.ReactNode }) {
  const contacts = await getContactUs()
  return (
    <>

      <Header contacts={contacts}/>


        {children}
           <NavMenuMobile />
           <Footer contacts={contacts} />
    </>
  );
}
