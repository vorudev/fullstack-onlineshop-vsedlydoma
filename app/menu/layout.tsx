import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Footer from "@/components/frontend/footer";
import Header from "@/components/frontend/header";
export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>

      <Header />


        {children}
           <NavMenuMobile />
           <Footer />
    </>
  );
}
