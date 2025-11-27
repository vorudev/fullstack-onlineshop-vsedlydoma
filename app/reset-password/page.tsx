import Link from "next/link";

import { ResetPasswordForm } from "@/components/forms/auth/reset-password-form";
import Image from "next/image";
import {Suspense} from 'react'; 

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="bg-white flex flex-col items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
  <Link href="/">
          <img
            src='/logo.webp'
            alt="Логотип"
            className="h-15 w-auto"
          />
          </Link>
        <ResetPasswordForm />
      
      </div>
    </div>
    </Suspense>
  );
}