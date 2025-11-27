import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Footer from "@/components/frontend/footer";
export default function ProductLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <>
        <Header />
 <main className="min-h-screen lg:bg-gray-100">
        {children}
                <NavMenuMobile />
                <Footer />
                </main>
      </>
    );
  }
