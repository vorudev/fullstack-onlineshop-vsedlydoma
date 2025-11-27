import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Footer from "@/components/frontend/footer";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
   <main className="bg-gray-100 lg:bg-white  "> 
            <Header />

            <NavMenuMobile />
        {children}
            <Footer />
               </main>
        </>
    );
}
