import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Footer from "@/components/frontend/footer";
export default function SearchLayout({ children }: { children: React.ReactNode }) {
    return (
        <>

             <Header />

           
            {children}
             <NavMenuMobile />
             <Footer />
        </>
    );
}
