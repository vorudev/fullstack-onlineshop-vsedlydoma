'use server';
import { db } from "@/db/drizzle";
import { privacyPolicy, termsOfService, PrivacyPolicy, TermsOfService } from "@/db/schema";
import { auth } from "../auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function getPrivacyPolicy() {
    const privacyPolicyData = await db.select().from(privacyPolicy);
    return privacyPolicyData[0];
}

export async function getTermsOfService() {
    const termsOfServiceData = await db.select().from(termsOfService);
    return termsOfServiceData[0];
}
export const updatePrivacyPolicy = async (privacyPolicyInfo: Omit<PrivacyPolicy, "createdAt" | "updatedAt">) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        
        if (!session || session.user.role !== 'admin') {
            return { error: 'Unauthorized', status: 401 };
        }
        
        const updatedPrivacyPolicyInfo = await db
            .update(privacyPolicy)
            .set(privacyPolicyInfo)
            .where(eq(privacyPolicy.id, privacyPolicyInfo.id))
            .returning(); // Добавьте .returning() если используете PostgreSQL
        
        // Верните простой объект вместо результата запроса
        return { 
            success: true, 
            data: updatedPrivacyPolicyInfo[0] // или updatedAboutInfo если это массив
        };
        
    } catch (error) {
        console.log(error);
        return { 
            success: false, 
            error: 'Failed to update privacy policy info' 
        };
    }
 };
 export const deletePrivacyPolicy = async (id: string) => {
    try{
     const session = await auth.api.getSession({
           headers: await headers()
         })
         if (!session || session.user.role !== 'admin') {
           return {
            success: false,
            error: 'Unauthorized',
            status: 401
           };
      }
     const deletedPrivacyPolicyInfo = await db.delete(privacyPolicy).where(eq(privacyPolicy.id, id));
     return {
        success: true,
        data: deletedPrivacyPolicyInfo
     };
    } catch (error) {
     console.log(error);
     return {
        success: false,
        error: 'Failed to delete privacy policy info'
     };
    }
 };
 export const createPrivacyPolicy = async (privacyPolicyInfo: Omit<PrivacyPolicy, "id" | "createdAt" | "updatedAt">) => {
    try{
     const session = await auth.api.getSession({
           headers: await headers()
         })
         if (!session || session.user.role !== 'admin') {
           return {
            success: false,
            error: 'Unauthorized',
            status: 401
           };
         }
     const createdPrivacyPolicyInfo = await db.insert(privacyPolicy).values(privacyPolicyInfo).returning();
      return {
        success: true,
        data: createdPrivacyPolicyInfo[0]
      };
    } catch (error) {
     console.log(error);
     return {
        success: false,
        error: 'Failed to create privacy policy info'
     };
    }
 };
 export const updateTermsOfService = async (termsOfServiceInfo: Omit<TermsOfService, "createdAt" | "updatedAt">) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
    
        if (!session || session.user.role !== 'admin') {
            return {
                success: false,
                error: 'Unauthorized',
                status: 401
            };
        }
        const updatedTermsOfServiceInfo = await db
            .update(termsOfService)
            .set(termsOfServiceInfo)
            .where(eq(termsOfService.id, termsOfServiceInfo.id))
            .returning();
        return {
            success: true,
            data: updatedTermsOfServiceInfo[0]
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: 'Failed to update terms of service info',
            status: 500
        };
    }
 };
 export const deleteTermsOfService = async (id: string) => {
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session || session.user.role !== 'admin') {
            return {
                success: false,
                error: 'Unauthorized',
                status: 401
            };
        }
    
    const deletedTermsOfServiceInfo = await db.delete(termsOfService).where(eq(termsOfService.id, id));
    return {
        success: true,
        data: deletedTermsOfServiceInfo
    };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: 'Failed to delete terms of service info',
    
        };
    }
 };
 export const createTermsOfService = async (termsOfServiceInfo: Omit<TermsOfService, "id" | "createdAt" | "updatedAt">) => {
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        })
    
    if (!session || session.user.role !== 'admin') {
        return {
            success: false,
            error: 'Unauthorized',
            status: 401
        };
    }
    const createdTermsOfServiceInfo = await db.insert(termsOfService).values(termsOfServiceInfo).returning();
    return {
        success: true,
        data: createdTermsOfServiceInfo[0]
    };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: 'Failed to create terms of service info',
            status: 500
        };
    }
 };