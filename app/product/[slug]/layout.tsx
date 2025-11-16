import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";

export default function ProductLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <>
        <Header />

        {children}
                <NavMenuMobile />
      </>
    );
  }
