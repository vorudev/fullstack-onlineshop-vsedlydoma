
import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
export default function CategoryLayout({ children }: { children: React.ReactNode }) {
    return (
    <>
    <Header />
    <div className="bg-gray-100">
           
            {children}
        </div>
    <NavMenuMobile />
    </>
)}