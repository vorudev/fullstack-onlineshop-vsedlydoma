
import Link from "next/link"

import {  SignupForm } from "@/components/forms/auth/signup-form"

export default function SignupPage() {

  return (
    <div className="bg-white flex flex-col items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
  <Link href="/">
          <img
            src='/logo.webp'
            alt="Логотип"
            className="h-15 w-auto"
          />
          </Link>
        <SignupForm />
      
      </div>
    </div>
  )
}
