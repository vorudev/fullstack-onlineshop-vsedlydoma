'use client';
import { useSession } from "@/lib/auth-client";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { ChangePasswordForm } from "@/components/forms/change-password-form";
export default function ProfilePage() {
    const { data: session } = useSession();
    return (
        <div>
            <h1>Profile</h1>
            <p>{session?.user?.name}</p>
            <p>{session?.user?.email}</p>
            <ChangePasswordForm />
        </div>
    );
}