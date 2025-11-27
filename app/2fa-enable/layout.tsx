import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Header from "@/components/frontend/header";
import Footer from "@/components/frontend/footer";

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
