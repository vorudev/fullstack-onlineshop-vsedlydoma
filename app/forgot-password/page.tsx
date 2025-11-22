import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { ForgotPasswordForm } from "@/components/forms/auth/forgot-password-form"

export default function LoginPage() {
  return (
    <div className="bg-white flex border-t  min-h-screen border-neutral-800 flex-col items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
  <Link href="/">
          <img
            src='/logo.webp'
            alt="Логотип"
            className="h-15 w-auto"
          />
          </Link>
        <ForgotPasswordForm />
      
      </div>
    </div>
  )
}