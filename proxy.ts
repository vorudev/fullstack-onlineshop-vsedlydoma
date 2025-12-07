import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import NextCache from "next/cache";
import { NextRequest } from "next/server";
import {betterAuth} from "better-auth";
import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";
const secureRoutes = ["/profile",]

export default async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const isSecureRoute = secureRoutes.some(route => pathname.startsWith(route));
   const session =  getSessionCookie(request);
   
    if (isSecureRoute && !session) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }
   
    return NextResponse.next();
}