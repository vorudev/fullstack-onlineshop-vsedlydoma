import Link from "next/link";

import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Link href="/">
          <img
            src='/brown.svg'
            alt="Логотип"
            className="h-6 w-auto"
          />
        </Link>
        <ResetPasswordForm />
      </div>
    </div>
  );
}