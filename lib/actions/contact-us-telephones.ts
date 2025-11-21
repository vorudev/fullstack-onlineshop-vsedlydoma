
'use server'
import { contactUsTelephones, ContactTelephone } from "@/db/schema";
import { db } from "@/db/drizzle"
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
export const createContactTelephone = async (values: Omit<ContactTelephone, "id" | "createdAt" | "updatedAt">) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const createdContactPhone = await db.insert(contactUsTelephones).values(values).returning();
   } catch (error) {
    console.log(error);
    return null;
   }
};
export const updateContactTelephone = async (values: Omit<ContactTelephone, "createdAt" | "updatedAt">) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const updatedContactPhone = await db.update(contactUsTelephones).set(values).where(eq(contactUsTelephones.id, values.id));
   } catch (error) {
    console.log(error);
    return null;
   }
};
export const deleteContactTelephone = async (id: string) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
    const deletedContactPhone = await db.delete(contactUsTelephones).where(eq(contactUsTelephones.id, id));
    return deletedContactPhone;
   } catch (error) {
    console.log(error);
    return null;
   }
};
