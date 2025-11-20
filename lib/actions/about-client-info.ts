
'use server'
import { clientInfo, ClientInfo } from "@/db/schema";
import { db } from "@/db/drizzle"
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
export const createClientInfo = async (values: Omit<ClientInfo, "id" | "createdAt" | "updatedAt">) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const createdClientInfo = await db.insert(clientInfo).values(values).returning();
   } catch (error) {
    console.log(error);
    return null;
   }
};
export const updateClientInfo = async (values: Omit<ClientInfo, "createdAt" | "updatedAt">) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const updatedClientInfo = await db.update(clientInfo).set(values).where(eq(clientInfo.id, values.id));
   } catch (error) {
    console.log(error);
    return null;
   }
};
export const deleteClientInfo = async (id: string) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
    const deletedClientInfo = await db.delete(clientInfo).where(eq(clientInfo.id, id));
    return deletedClientInfo;
   } catch (error) {
    console.log(error);
    return null;
   }
};
