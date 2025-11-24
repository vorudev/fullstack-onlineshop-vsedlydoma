'use server';

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";


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
            email: email,
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
const belarusPhoneSchema = z
  .string()
  .trim()
  // Удаляем все пробелы, дефисы, скобки
  .transform((val) => val.replace(/[\s\-()]/g, ''))
  // Удаляем потенциально опасные символы
  .transform((val) => val.replace(/[<>{}[\]\\'"`;]/g, ''))
  // Нормализация: преобразуем 8 в +375
  .transform((val) => {
    if (val.startsWith('8')) {
      return '+375' + val.slice(1);
    }
    if (val.startsWith('375')) {
      return '+' + val;
    }
    return val;
  })
  // Проверка формата белорусского номера
  .refine(
    (val) => /^\+375(25|29|33|44)\d{7}$/.test(val),
    {
      message: 'Неверный формат белорусского номера. Используйте формат: +375291234567'
    }
  )
  // Дополнительная проверка на валидность кода оператора
  .refine(
    (val) => {
      const operatorCode = val.slice(4, 6);
      const validCodes = ['25', '29', '33', '44']; // МТС, А1, Life, Белтелеком
      return validCodes.includes(operatorCode);
    },
    {
      message: 'Неверный код оператора. Доступные: 25 (Life), 29 (А1/Velcom), 33 (МТС), 44 (Белтелеком)'
    }
  );

/**
 * Расширенная схема с дополнительными проверками
 */
const phoneNumberSchema = z.object({
  phoneNumber: belarusPhoneSchema
});

type PhoneNumberInput = z.infer<typeof phoneNumberSchema>;

/**
 * Санитизация номера телефона (дополнительная защита)
 */
function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';
  
  return phone
    .trim()
    .slice(0, 20) // Ограничиваем максимальную длину
    .replace(/[^\d+\s\-()]/g, '') // Оставляем только цифры, +, пробелы, дефисы, скобки
    .replace(/[<>{}[\]\\'"`;]/g, ''); // Удаляем опасные символы
}

/**
 * Проверка, что номер еще не используется другим пользователем
 */
async function isPhoneNumberUnique(phoneNumber: string, currentUserId: string): Promise<boolean> {
  try {
    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.phoneNumber, phoneNumber))
      .limit(1);
    
    // Номер уникален если не найден или принадлежит текущему пользователю
    return existingUser.length === 0 || existingUser[0].id === currentUserId;
  } catch (error) {
    console.error('Ошибка проверки уникальности номера:', error);
    return false;
  }
}

/**
 * Основная функция добавления номера телефона
 */
export async function addPhoneNumber(phoneNumber: string) {
  try {
    // 1. Проверка аутентификации
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return { 
        success: false, 
        message: 'Необходима авторизация',
        code: 'UNAUTHORIZED'
      };
    }

    // 2. Санитизация входных данных
    const sanitizedPhone = sanitizePhoneNumber(phoneNumber);

    if (!sanitizedPhone) {
      return {
        success: false,
        message: 'Номер телефона не может быть пустым',
        code: 'EMPTY_PHONE'
      };
    }

    // 3. Валидация с помощью Zod
    const validationResult = phoneNumberSchema.safeParse({
      phoneNumber: sanitizedPhone
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error?.message || 'Неверный формат номера';
      return {
        success: false,
        message: errorMessage,
        code: 'INVALID_FORMAT',
        errors: validationResult.error
      };
    }

    const validatedPhone = validationResult.data.phoneNumber;

    // 4. Проверка уникальности номера
    const isUnique = await isPhoneNumberUnique(validatedPhone, session.user.id);
    
    if (!isUnique) {
      return {
        success: false,
        message: 'Этот номер телефона уже используется',
        code: 'PHONE_EXISTS'
      };
    }

    // 5. Обновление в базе данных
    await db
      .update(user)
      .set({
        phoneNumber: validatedPhone,
        updatedAt: new Date() // Если есть такое поле
      })
      .where(eq(user.id, session.user.id));

    // 6. Логирование успешной операции (опционально)
    console.info(`Номер телефона обновлен для пользователя ${session.user.id}`);

    return {
      success: true,
      message: 'Номер телефона успешно добавлен',
      phoneNumber: validatedPhone
    };

  } catch (error) {
    // Логируем ошибку на сервере
    console.error('Ошибка при добавлении номера телефона:', error);

    // Не раскрываем детали ошибки клиенту
    return { 
      success: false, 
      message: 'Произошла ошибка при добавлении номера. Попробуйте позже.',
      code: 'SERVER_ERROR'
    };
  }
}

/**
 * Функция для форматирования номера для отображения
 */


/**
 * Функция для удаления номера телефона
 */
export async function removePhoneNumber() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return { 
        success: false, 
        message: 'Необходима авторизация',
        code: 'UNAUTHORIZED'
      };
    }

    await db
      .update(user)
      .set({
        phoneNumber: null,
        updatedAt: new Date()
      })
      .where(eq(user.id, session.user.id));

    return {
      success: true,
      message: 'Номер телефона успешно удален'
    };

  } catch (error) {
    console.error('Ошибка при удалении номера телефона:', error);
    
    return { 
      success: false, 
      message: 'Произошла ошибка при удалении номера',
      code: 'SERVER_ERROR'
    };
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