import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {headers} from 'next/headers'
import {auth } from '@/lib/auth'
import { CheckCircle } from "lucide-react"
import { NextResponse } from "next/server"
import { redirect } from "next/navigation"

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
        <SidebarTrigger  className="w-10 h-10 bg-neutral-800" /> 

        {children}
      </main>
    </SidebarProvider>
  )
}