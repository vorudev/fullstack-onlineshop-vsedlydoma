import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { TwoFactorAuthForm } from "@/components/forms/auth/two-factor-form"

export default async function TwoFactorAuthEnable() {
    const session = await auth.api.getSession(
        {
            headers: await headers(),
        }
    )
    if (session === null) {
        redirect("/")
    }
    return (
        <div className="px-4 w-full flex-col gap-10 bg-gray-100 lg:p-5 pt-3  mx-auto text-black flex items-center min-h-screen">
            <h1 className="lg:text-[24px] text-[20px] font-semibold lg:px-8"> Двухфакторная аутентификация</h1>
            <div className="w-full max-w-md rounded-xl p-5 bg-white" ><TwoFactorAuthForm isEnabled={session?.user?.twoFactorEnabled || false} /></div>
        </div>
    )
}