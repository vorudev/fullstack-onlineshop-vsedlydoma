'use server';

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";



export const signIn = async (email: string, password: string) => { 
    try {
    await auth.api.signInEmail( { 
        body: { 
             email,
            password
        }
    })
    return { 
        success: true, 
        message: "Signed in successfully"
    }
  
} catch (error)
 {
    const e = error as Error
    return { 
        success: false, 
        message: e.message || "Something went wrong"
    }
}

}
export const signUp = async (email: string, password: string, username: string) => { 
     try {
    await auth.api.signUpEmail( { 
        body: { 
            email,
            password,
            name: username,
        }
    })
    return { 
        success: true, 
        message: "Signed up successfully"
    }
  
} catch (error)
 {
    const e = error as Error
    return { 
        success: false, 
        message: e.message || "Something went wrong"
    }
}
}
export const updateUserName = async (name: string) => { 
    try {
        await auth.api.updateUser({
            body: {
               name,
            }
        })
        return { 
            success: true, 
            message: "Имя успешно изменено"
        }
    } catch (error) {
        const e = error as Error
        return { 
            success: false, 
            message: e.message || "Ошибка при изменении имени"
        }
     
    
    }
 
}
export async function addPhoneNumber(phoneNumber: string) { 
    try {
      const session = await auth.api.getSession({
        headers: await headers()
      })
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      await db.update(user).set({
        phoneNumber: phoneNumber
      }).where(eq(user.id, session.user.id));
    } catch (error) {
        const e = error as Error
        return { 
            success: false, 
            message: e.message || "Ошибка при добавлении номера"
        }
      
    
    }
 
}
export const updatePhoneNumber = async (phoneNumber: string) => { 
    try {
        await auth.api.updateUser({
            body: {
               phoneNumber,
            }
        })
        return { 
            success: true, 
            message: "Номер успешно изменен"
        }
    } catch (error) {
        const e = error as Error
        return { 
            success: false, 
            message: e.message || "Ошибка при изменении номера"
        }
      
    
    }
 
}