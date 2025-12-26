// app/(frontend)/layout.tsx
import Footer from "@/components/frontend/footer";
import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import { getContactUs } from "@/lib/actions/contact-us";

export default async function FrontendLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const contacts = await getContactUs();
  return (
    <>
      <Header contacts={contacts} />
      <div className="bg-gray-100">
        {children}
        <NavMenuMobile />
        <Footer contacts={contacts} />
      </div>
    </>
  );
}