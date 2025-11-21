
'use server'
import { contactPhones, ContactPhone } from "@/db/schema";
import { db } from "@/db/drizzle"
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
export const createContactPhone = async (values: Omit<ContactPhone, "id" | "createdAt" | "updatedAt">) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const createdContactPhone = await db.insert(contactPhones).values(values).returning();
   } catch (error) {
    console.log(error);
    return null;
   }
};
export const updateContactPhone = async (values: Omit<ContactPhone, "createdAt" | "updatedAt">) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const updatedContactPhone = await db.update(contactPhones).set(values).where(eq(contactPhones.id, values.id));
   } catch (error) {
    console.log(error);
    return null;
   }
};
export const deleteContactPhone = async (id: string) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
    const deletedContactPhone = await db.delete(contactPhones).where(eq(contactPhones.id, id));
    return deletedContactPhone;
   } catch (error) {
    console.log(error);
    return null;
   }
};
