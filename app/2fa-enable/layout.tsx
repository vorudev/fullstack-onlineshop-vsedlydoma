import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Header from "@/components/frontend/header";
import Footer from "@/components/frontend/footer";
import { getContactUs } from "@/lib/actions/contact-us";
export default async function MenuLayout({ children }: { children: React.ReactNode }) {
  const contacts = await getContactUs()
  return (
    <>

      <Header contacts={contacts} />
 <main className="bg-gray-100">
        {children}
           <NavMenuMobile />
           <Footer contacts={contacts} />
           </main>
    </>
  );
}
