"use server";
import { Calendar, Home, User, Phone,  ClipboardList, Package, ChartBarStacked, Info, ChevronLeft} from "lucide-react"
import Link from "next/link"
import AdminPageUser from "./frontend/admin-page-user";
import { getPendingOrdersCount } from "@/lib/actions/orders";
import { getPendingReviewsCount } from "@/lib/actions/reviews";
import {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
    SidebarFooter,
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
import { ChevronUp, ChevronDown, User2, UserPlusIcon, Newspaper, Bell } from "lucide-react"
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
  {
    title: "Контактная информация",
    url: "/dashboard/contact-us",
    icon: Info ,
  },
  {
    title: "Новости",
    url: "/dashboard/news",
    icon: Newspaper,
  },
  {
    title: "Уведомления",
    url: "/dashboard/notifications",
    icon: Bell,
  },
  
]

export async function AppSidebar() {
  const [countReviews, countOrder] = await Promise.all([ 
    getPendingReviewsCount(),
    getPendingOrdersCount()
       ]);

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
                    <Link 
  href="/dashboard/order" 
  className={` ${countOrder > 0 ? "bg-green-600/20  " : ""}`}
>
  {countOrder > 0 ? (
    <span className="font-semibold text-green-500">
      Активные {countOrder}
    </span>
  ) : (
    <span className=" ">
      Нет активных заказов
    </span>
  )}
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
  className={` ${countReviews > 0 ? "bg-red-700/20  " : ""}`}
>
  {countReviews > 0 ? (
    <span className="font-semibold text-red-500">
      Требуют одобрения {countReviews}
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
           <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild >
                  <Link href="/" className="h-15 flex items-center gap-2 px-2 cursor-pointer">
                    <ChevronLeft className="size-4 text-gray-100" /> <span className="text-[15px] text-gray-100">На сайт</span>
                  </Link>
                </DropdownMenuTrigger>
              </DropdownMenu>
            </SidebarMenuItem>
            
            
          </SidebarMenu>
            

        </SidebarFooter>
    </Sidebar>
  )
}