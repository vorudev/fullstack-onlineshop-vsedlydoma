'use server';

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";


export const signIn = async (email: string, password: string) => {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    })
    if ("twoFactorRedirect" in result) {
      return {
        success: false,
        requiresTwoFactor: true,
        message: "Введите код двухфакторной аутентификации"
      }
    }
    return {
      success: true,
      requiresTwoFactor: false,
      message: "Вход выполнен успешно"
    }
} catch (error) {
    const e = error as Error
    return {
      success: false,
      requiresTwoFactor: false,
      message: e.message || "Ошибка при входе"
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


{/*
    export const enableTwoFactor = async (password: string) => { 
    try {
        await auth.api.enableTwoFactor({
            body: {
                password,
                issuer: "Все для дома",
            },
            headers: await headers()
        })
        return { 
            success: true, 
            message: "Двухфакторная аутентификация успешно включена"
        }
    } catch (error) {
        const e = error as Error
        return { 
            success: false, 
            message: e.message || "Ошибка при включении двухфакторной аутентификации"
        }
      
    
    }
 
}
    export const disableTwofa = async (password: string) => { 
    try {
        await auth.api.disableTwoFactor({
            body: {
                password,
            },
            headers: await headers()
        })
        return { 
            success: true, 
            message: "Двухфакторная аутентификация успешно отключена"
        }
    } catch (error) {
        const e = error as Error
        return { 
            success: false, 
            message: e.message || "Ошибка при отключении двухфакторной аутентификации"
        }
      
    
    }
 
}
    export const getTotp = async (password: string) => { 
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return {
                success: false,
                error: 'Unauthorized'
            };
        }

        const totpUri = await auth.api.getTOTPURI({
            body: { password,
             },
            headers: await headers()
        });

        return { 
            success: true, 
            message: "TotpUri успешно получен",
            totpUri
        };

    } catch (error) {
        const e = error as Error;
        return { 
            success: false, 
            message: e.message || "Ошибка при получении TOTP URI"
        };
    }
};

export const verifytotp = async (code: string, trustDevice: boolean) => { 
    try {
        await auth.api.verifyTOTP({
            body: {
                code,
                trustDevice,
            },
            headers: await headers()
        })
        return { 
            success: true, 
            message: "Totp успешно проверен"
        }
    } catch (error) {
        const e = error as Error
        return { 
            success: false, 
            message: e.message || "Ошибка при проверке TOTP"
        }
      
    
    }
 
}
    */}