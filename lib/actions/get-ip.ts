'use server';
import { headers } from "next/headers";

export async function getIp() { 
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get("x-real-ip");
if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
}
if (realIp) {
    return realIp.split(",")[0].trim();
}
return null ;
}