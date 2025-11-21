'use server'

import { contactUs, contactPhones, ContactPhone, ContactUs, contactUsTelephones} from "@/db/schema"
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
export const getContactUs = async () => {
   try{
    const contactUsInfo = await db.select().from(contactUs);
 const [clientInfoData, contactUsTelephonesData] = await Promise.all([
  db.select().from(contactPhones).where(eq(contactPhones.contactUsId, contactUsInfo[0].id)),
  db.select().from(contactUsTelephones).where(eq(contactUsTelephones.contactUsId, contactUsInfo[0].id)),
 ])
    const contactUsInfoData = {
      ...contactUsInfo[0],
      clientInfo: clientInfoData,
      contactUsTelephones: contactUsTelephonesData,
    };
    return contactUsInfoData;
   } catch (error) {
    console.log(error);
    return null;
   }
};

export const updateContactUs = async (contactUsInfo: Omit<ContactUs, "createdAt" | "updatedAt">) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const updatedContactUsInfo = await db.update(contactUs).set(contactUsInfo).where(eq(contactUs.id, contactUsInfo.id));
    return updatedContactUsInfo;
   } catch (error) {
    console.log(error);
    return null;
   }
};
export const deleteContactUsInfo = async (id: string) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
    const deletedContactUsInfo = await db.delete(contactUs).where(eq(contactUs.id, id));
    return deletedContactUsInfo;
   } catch (error) {
    console.log(error);
    return null;
   }
};
export const createContactUsInfo = async (contactUsInfo: Omit<ContactUs, "id" | "createdAt" | "updatedAt">) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const createdContactUsInfo = await db.insert(contactUs).values(contactUsInfo).returning();
    
    
   } catch (error) {
    console.log(error);
    return null;
   }
};