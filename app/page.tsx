import Link from "next/link";
import HomePage from "@/components/frontend/home";
import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import { getCategories } from "@/lib/actions/product-categories";
import {Suspense} from 'react';
import { getContactUs } from "@/lib/actions/contact-us";
import Footer from "@/components/frontend/footer";
export default async function Home() {
const contacts = await getContactUs()
  return (

    <main className="">
<Header  contacts={contacts}/>
<HomePage />
 <NavMenuMobile />
   <Footer contacts={contacts}/>
    </main>
  

  );
}
