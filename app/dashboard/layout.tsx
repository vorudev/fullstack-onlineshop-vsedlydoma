import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {headers} from 'next/headers'
import {auth } from '@/lib/auth'
import { CheckCircle } from "lucide-react"
import { NextResponse } from "next/server"
import { redirect } from "next/navigation"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Админ панель",
  description: "Мы более 10 лет на рынке, проверены временем в мире сантехники и товаров для дома в Минске. Консультации специалистов, доступные цены, большой ассортимент",
  keywords: "санхника, строительные материалы, сантехнические услуги, Минск, ремонт, консультации, товары для дома, сантехника минск, строительные материалы минск, сантехнические услуги минск, товары для дома минск",
  robots: { 
    index: true,
    follow: true, 
    nocache: false,
    googleBot: { 
        index: true, 
        follow: true, 
        "max-snippet": -1, 
        "max-image-preview": "large",
        "max-video-preview": "large"
    }
}
};
export default async function Layout({ children }: { children: React.ReactNode }) {
const session = await auth.api.getSession({ headers: await headers() })

if (session == null) return redirect("/")
const hasAccess = await auth.api.userHasPermission({
  headers: await headers(),
  body: { permission: { user: ["list"] } },
})
if (!hasAccess.success) return redirect("/")

  return (
    <SidebarProvider>
      <AppSidebar/>
      <main className="dark w-full bg-background">
        <SidebarTrigger  className="w-10 h-10 m-1 bg-neutral-800" /> 

        {children}
      </main>
    </SidebarProvider>
  )
}