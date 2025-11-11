import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, phoneNumber } from "better-auth/plugins"
import { schema } from "@/db/schema";
import { db } from "@/db/drizzle"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/email/reset-password";
const resend = new Resend(process.env.RESEND_API_KEY as string);


export const auth = betterAuth({ 
socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 

    },
    updateUser: true,
emailAndPassword: {  
        enabled: true, 
        sendResetPassword: async ({user, url}) => {
            resend.emails.send({
                from: 'onboarding@resend.dev',
                to: user.email,
                subject: 'Reset Password',
                react: ForgotPasswordEmail({username: user.name, resetUrl: url, userEmail: user.email}) 
            })
        }
    },




database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema,

    }),
    session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    // BUG: Prob a bug with updateAge method. It throws an error - Argument `where` of type SessionWhereUniqueInput needs at least one of `id` arguments. 
    // As a workaround, set updateAge to a large value for now.
    updateAge: 60 * 60 * 24 * 7, // 7 days (every 7 days the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // Cache duration in seconds
    }
  },
  
plugins: [admin(), nextCookies(), phoneNumber()],
});

export type Session = typeof auth.$Infer.Session;