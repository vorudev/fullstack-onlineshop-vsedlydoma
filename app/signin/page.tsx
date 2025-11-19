
import Link from "next/link"

import {LoginForm} from "@/components/forms/login-form"

export default function SignupPage() {

  return (
    <div className="bg-black flex border-t border-neutral-800 flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
  <Link href="/">
          <img
            src='/images/logo.png'
            alt="Логотип"
            className="h-6 w-auto"
          />
          </Link>
        <LoginForm />
      
      </div>
    </div>
  )
}
