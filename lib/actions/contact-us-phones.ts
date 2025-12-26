
'use server'
import { contactPhones, ContactPhone } from "@/db/schema";
import { db } from "@/db/drizzle"
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
export const createContactPhone = async (values: Omit<ContactPhone, "id" | "createdAt" | "updatedAt">) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const createdContactPhone = await db.insert(contactPhones).values(values).returning();
    revalidateTag('contact-us', 'layout');
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
    revalidateTag('contact-us', 'layout');
   } catch (error) {
    console.log(error);
    return null;
   }
};
export const deleteContactPhone = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    if (!session || session.user.role !== 'admin') {
      return { 
        success: false, 
        error: 'Unauthorized' 
      };
    }
    await db.delete(contactPhones).where(eq(contactPhones.id, id));
    revalidateTag('contact-us', 'layout');
    return { 
      success: true,
      message: 'Contact phone deleted successfully' 
    };
    
  } catch (error) {
    console.log(error);
    return { 
      success: false, 
      error: 'Failed to delete contact phone' 
    };
  }
};