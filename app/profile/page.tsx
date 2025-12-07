'use server'
import ProfilePage from "./client"
import { Auth } from "better-auth";
import {headers} from "next/headers"
import {TwoFactorAuthForm} from "@/components/forms/auth/two-factor-form"
import {getUserOrders} from "@/lib/actions/orders"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
interface PageProps {
    searchParams: Promise<{ // Добавляем Promise
        page?: string;
        search?: string;
        status?: string;
      }>;
}
export default async function Profile({searchParams}: PageProps) {
     const { page, search, status} = await searchParams;
     const session = await auth.api.getSession({
 headers: await headers()
     })
     if (session === null) {
        redirect("/signin")
     }
   const currentPage = Number(page) || 1;
  const searchQuery = search || '';
    const {orders, pagination} = await getUserOrders(
        {
            page: currentPage,
            pageSize: 10,
            search: searchQuery,
            status: status,
        }
    );
    return <ProfilePage orders={orders} pagination={pagination} session={session}  />
}