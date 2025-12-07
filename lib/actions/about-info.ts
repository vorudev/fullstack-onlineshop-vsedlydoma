'use server'
import { about, About, clientInfo, ClientInfo } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
export const getAboutInfo = async () => {
   try{
    const aboutInfo = await db.select().from(about);
   const clientInfoData = await db.select().from(clientInfo).where(eq(clientInfo.aboutId, aboutInfo[0].id));
    const aboutInfoData = {
      ...aboutInfo[0],
      clientInfo: clientInfoData,
    };
    return aboutInfoData;
   } catch (error) {
    console.log(error);
    return null;
   }
};

export const updateAboutInfo = async (aboutInfo: Omit<About, "createdAt" | "updatedAt">) => {
   try {
       const session = await auth.api.getSession({
           headers: await headers()
       })
       
       if (!session || session.user.role !== 'admin') {
           return { error: 'Unauthorized', status: 401 };
       }
       
       const updatedAboutInfo = await db
           .update(about)
           .set(aboutInfo)
           .where(eq(about.id, aboutInfo.id))
           .returning(); // Добавьте .returning() если используете PostgreSQL
       
       // Верните простой объект вместо результата запроса
       return { 
           success: true, 
           data: updatedAboutInfo[0] // или updatedAboutInfo если это массив
       };
       
   } catch (error) {
       console.log(error);
       return { 
           success: false, 
           error: 'Failed to update about info' 
       };
   }
};
export const deleteAboutInfo = async (id: string) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
    const deletedAboutInfo = await db.delete(about).where(eq(about.id, id));
    return deletedAboutInfo;
   } catch (error) {
    console.log(error);
    return null;
   }
};
export const createAboutInfo = async (aboutInfo: Omit<About, "id" | "createdAt" | "updatedAt">) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const createdAboutInfo = await db.insert(about).values(aboutInfo).returning();
    
   } catch (error) {
    console.log(error);
    return null;
   }
};
   
