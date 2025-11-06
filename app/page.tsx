import Link from "next/link";
import HomePage from "@/components/frontend/home";
import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import { getCategories } from "@/lib/actions/product-categories";
import {Suspense} from 'react';
export default async function Home() {

  return (
<Suspense fallback={<div>Loading...</div>}>
    <main className="">
<Header />
<HomePage />
 <NavMenuMobile />
    </main>
    </Suspense>
  );
}
