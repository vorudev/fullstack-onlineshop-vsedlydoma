
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "./context/cartcontext";
import { Toaster } from "sonner";
import "./globals.css";
import { FavoriteProvider } from "./context/favoritecontext";
import Header from "@/components/frontend/header";
import NavMenuMobile from "@/components/frontend/nav-menu-mobile";
import { ConsentManager } from "./consent-manager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Все для дома",
  description: "Магазин Всё для дома в Минске — сантехника, строительные материалы, инструменты и товары для ремонта. Широкий выбор, доступные цены.",
  keywords: "санхника, строительные материалы, сантехнические услуги, Минск, ремонт, консультации, товары для дома, сантехника минск, строительные материалы минск, сантехнические услуги минск, товары для дома минск",
 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-white`}
          >
    		<ConsentManager 
        >
    			

          <FavoriteProvider>
            <CartProvider>

              {children}
    <Toaster richColors />
            </CartProvider>
          </FavoriteProvider>
          
    		</ConsentManager>
    	</body>
        </html>
      )
}
