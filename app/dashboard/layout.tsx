import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {headers} from 'next/headers'
import {auth } from '@/lib/auth'
import { NextResponse } from "next/server"
import { redirect } from "next/navigation"

export default async function Layout({ children }: { children: React.ReactNode }) {
const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session || session.user.role !== 'admin') {
      
      redirect('/')
     
    }

  return (
    <SidebarProvider>
      <AppSidebar/>
      <main className="dark w-full bg-background">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}