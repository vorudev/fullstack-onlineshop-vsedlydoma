"use server";
import { Calendar, Home, Inbox, Search, Settings, User,  ClipboardList, Package, ChartBarStacked} from "lucide-react"
import Link from "next/link"
import { getPendingReviewsCount } from "@/lib/actions/reviews";
import { Badge } from "./ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,

} from "@/components/ui/sidebar"
import { DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronUp, ChevronDown, User2, UserPlusIcon } from "lucide-react"
import { da } from "zod/v4/locales";


const items = [
  {
    title: "Главная",
    url: "/dashboard",
    icon: Home,
  },

  {
    title: "Пользователи",
    url: "/dashboard/users",
    icon: User,
  },
  {
    title: "Товары",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Производители",
    url: "/dashboard/manufacturers",
    icon: UserPlusIcon,
  },
  {
    title: "Категории",
    url: "/dashboard/categories",
    icon: ChartBarStacked,
  },
]

export async function AppSidebar() {
    const count = await getPendingReviewsCount();
  return (
    <Sidebar>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* Collapsible секция */}
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <ClipboardList /> {/* Иконка */}
                  <span>Заказы</span>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/dashboard/order">
                        <span>Активные</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/dashboard/order/archive">
                        <span>Выполненные</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/dashboard/order/cancelled">
                        <span>Отмененные</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
           <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <ClipboardList /> {/* Иконка */}
                  <span>Отзывы</span>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
<Link 
  href="/dashboard/reviews/pending" 
  className={` ${count > 0 ? "bg-red-700/20  " : ""}`}
>
  {count > 0 ? (
    <span className="font-semibold text-red-500">
      Требуют одобрения {count}
    </span>
  ) : (
    <span className=" ">
      Нет требующих одобрения
    </span>
  )}
</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/dashboard/reviews/approved">
                        <span>Одобреные</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
       <SidebarFooter>
          {/* <PendingReviewsCount /> <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-15">
                    <User2 /> <div className="flex flex-col ">
                      <p>{session?.user.name} </p>
                      <p>{session?.user.email}</p>
                    </div>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            
            
          </SidebarMenu>
            */}

        </SidebarFooter>
    </Sidebar>
  )
}