'use server'

import { currentDollarPrice, DollarRate, products, Product } from "@/db/schema"
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
export const getCurrentDollarPrice = async () => {
   try{
    const currentDollarPriceData = await db.select().from(currentDollarPrice);
    return currentDollarPriceData[0];
   } catch (error) {
    console.log(error);
    return null;
   }
};

export const updateDollarRate = async (dollarRate: Omit<DollarRate, "createdAt" | "updatedAt">) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    const updatedDollarRate = await db.update(currentDollarPrice).set(dollarRate).where(eq(currentDollarPrice.id, dollarRate.id));
    return updatedDollarRate;
   } catch (error) {
    console.log(error);
    return null;
   }
};
export const deleteDollarRate = async (id: string) => {
   try{
    const session = await auth.api.getSession({
          headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
    const deletedDollarRate = await db.delete(currentDollarPrice).where(eq(currentDollarPrice.id, id));
    return deletedDollarRate;
   } catch (error) {
    console.log(error);
    return null;
   }
};
export const createDollarRate = async (dollarRate: Omit<DollarRate, "id" | "createdAt" | "updatedAt">) => {
  try{
     const session = await auth.api.getSession({
        headers: await headers()
     })
     if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     const createdDollarRate = await db.insert(currentDollarPrice).values(dollarRate).returning();
  } catch (error) {
     console.log(error);
     return null;
  }
};

export const synchronizeCurrency = async () => { 
  try { 
     const session = await auth.api.getSession({
        headers: await headers()
     });
     if (!session || session.user.role !== 'admin') {
        return { success: false, error: 'Unauthorized' };
     }
     const currentDollar = await getCurrentDollarPrice()
     if (!currentDollar || currentDollar.value === null) { 
        throw new Error("Не указан курс доллара");
     }
     const result = await db
        .update(products)
        .set({
           priceRegional: sql`ROUND(${products.price} * ${currentDollar.value}, 2)`,
           updatedAt: new Date(),
        })
        .returning({ id: products.id })
     return {
        success: true,
        count: result.length,
        message: `Обновлено ${result.length} товаров`
     };
  } catch (error) {
     console.error('Error updating prices:', error);
     return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка обновления цен'
     };
  }
}