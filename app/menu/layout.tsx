import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import Header from "@/components/frontend/header";
import { Suspense } from "react";

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
     <Suspense fallback="Загрузка...">
      <Header />
      </Suspense>

        {children}
           <NavMenuMobile />
    </>
  );
}
