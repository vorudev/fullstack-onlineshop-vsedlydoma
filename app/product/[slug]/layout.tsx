import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Footer from "@/components/frontend/footer";
import type { Metadata } from "next";
import { getContactUs } from "@/lib/actions/contact-us";
export default async function ProductLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const contacts = await getContactUs()
    return (
      <>
        <Header contacts={contacts} />
 <main className="min-h-screen lg:bg-gray-100">
        {children}
                <NavMenuMobile />
                <Footer contacts={contacts}   />
                </main>
      </>
    );
  }
